import getpass
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
# from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI
import sqlite3
from flask import Blueprint, request, jsonify, send_file, Response,current_app
from gtts import gTTS
from utils.voice import stt
import io
import json
import time
from pydub import AudioSegment
from utils.supabase import supabase
load_dotenv()

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

chat_bp = Blueprint('chat', __name__)
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)
workflow = StateGraph(state_schema=MessagesState)


def call_model(state: MessagesState):
  response = model.invoke(state["messages"])
  return {"messages": response}

workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

conn = sqlite3.connect("conversations.db", check_same_thread=False)

memory = SqliteSaver(conn=conn)

app = workflow.compile(checkpointer=memory)


@chat_bp.route("/create_chat", methods=["POST"])
def create_chat():
  data = request.get_json()
  if not data or not all(key in data for key in ['rid', 'uid', 'recipe']):
    return jsonify({'message': 'Missing data: recipe, uid, rid'}), 400
  uid=data.get('uid')
  rid=data.get('rid')
  

  response = (
      supabase.table("conversations")
      .insert({
        "user_id":uid,
        "recipe_id":rid,
      })
      .execute()
  )
  
  data=response.data[0]
  cid=data['chat_id']
  config = {"configurable": {"thread_id": cid}}
  recipes_response = (
      supabase.table('recipes')
      .select('*')
      .eq('id', rid)
      .single()
      .execute()
  )
  recipe=recipes_response.data
  # print(str(recipe))

  instructions=(
  f"For the following recipe in json... {recipe}, analyze it"
  "youll will first introduce yourself, describe the recipe"
  "then user will be transversing through the instructions as the" \
  "but that isnt your responasbility as the"
  "code has prerecorded messages for each step and"
  "keywords to signify when to go to the next step, previous step, or to repeat a step"
  "your focus is outside of that where you are gonna help the user when they have issues"
  "like providing ingredient alternatives, when they mess up, confusion clarification, etc"
  "you will be given the user step for context etc")
  
  initial_messages = [
      SystemMessage(content=instructions),
      HumanMessage(content="Hi! Please start teaching me the recipe.")
  ]

  first_response = app.invoke({"messages": initial_messages}, config)
  mp3_fp = io.BytesIO()
  try:
    tts = gTTS(first_response["messages"][-1].content, lang='en')
    tts.write_to_fp(mp3_fp)
  except Exception as e:
    return jsonify({"message":"Speech could not be generated"}), 500
  
  mp3_fp.seek(0)
  
  return send_file(
    mp3_fp,
    mimetype='audio/mpeg',
    as_attachment=True,
    download_name='intro.mp3'
  ), 200

@chat_bp.route("/chat", methods=["POST"])
def chat():


  cid = request.form.get('cid')
  if 'audio' not in request.files or not cid:
    return jsonify({'message': 'Missing data: audio file or cid'}), 400
  file=request.files['audio']


  try:
    userAudio = AudioSegment.from_file(file)
    userAudio = userAudio.set_frame_rate(16000)
    userAudio = userAudio.set_channels(1)
    buffer = io.BytesIO()
    userAudio.export(buffer, format="raw")
    userAudioBytes = buffer.getvalue()


  except Exception as e:
      return jsonify({'message': 'Could not process audio file.'}), 500

  userMessage = stt(userAudioBytes)
  print('-----------------------------------')
  print(userMessage)
  chat_response = (
      supabase.table('conversations')
      .select('*')
      .eq('chat_id', cid)
      .single()
      .execute()
  )
  chat=chat_response.data
  rid=chat['recipe_id']
  uid=chat['user_id']

  recipes_response = (
      supabase.table('recipes')
      .select('*')
      .eq('id', rid)
      .single()
      .execute()
  )
  recipe=recipes_response.data
  chat_message=""
  print(userMessage)
  if "next" in userMessage:
    if(chat['state']>=len(recipe['ai_instructions']['ai_steps'])):
      chat_message="The recipe has been completed. Please feel free to restart or checkout other recipes."
    else:
      chat_message=recipe['ai_instructions']['ai_steps'][chat['state']]['description']
      update_response = (
        supabase.table('conversations')
        .update({'state':(chat['state']+1)})  
        .eq('chat_id', cid)
        .execute()
      )
  elif "previous" in userMessage:
    if(chat['state']<=1):
      chat_message="You are on the first step. You cannot got back any further"
    else:
      chat_message=recipe['ai_instructions']['ai_steps'][chat['state']-2]['description']
  elif "repeat" in userMessage:
    if(chat['state']==1):
      chat_message="We have not started yet, please say next to continue"
    else:  
      chat_message=recipe['ai_instructions']['ai_steps'][chat['state']-1]['description']
  else:
    config = {"configurable": {"thread_id": cid}}
    start_time = time.perf_counter()
    response = app.invoke({"messages": [HumanMessage(content=userMessage)]}, config)
    end_time = time.perf_counter()


    duration = end_time - start_time
    print(f"The code took {duration:.6f} seconds to run.")
    chat_message=response["messages"][-1].content
  try:
    wav_fp = io.BytesIO()
    tts = gTTS(chat_message, lang='en')
    tts.write_to_fp(wav_fp)
  except Exception as e:
    return jsonify({"message":"Speech could not be generated"}), 500
  
  wav_fp.seek(0)
  
  return send_file(
    wav_fp,
    mimetype='audio/wav',
    as_attachment=True,
    download_name='response.wav'
  ), 200
  

@chat_bp.route('/upload',methods=['POST'])
def upload_file():
  if 'audio' not in request.files:
    return jsonify({'error':'no audio file'}), 400
  file=request.files['audio']

  if file.filename=='':
    return jsonify({'error':'no audio file selected'}), 400
  
  if file:
    print(file.filename)
    save_path= os.path.join(current_app.config['UPLOAD_FOLDER'],file.filename)
    try:
      file.save(save_path)

      return jsonify({
        'message': 'File uploaded successfully',
        'filename': file.filename
      }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to save file: {str(e)}'}), 500

  return jsonify({'error': 'Unknown error'}), 500
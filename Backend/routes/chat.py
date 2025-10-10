import getpass
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain.chat_models import init_chat_model
from flask import Blueprint, request, jsonify, send_file
from gtts import gTTS
import io
import json
load_dotenv()

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

chat_bp = Blueprint('chat', __name__)

@chat_bp.route("/create_chat", methods=["POST"])
def create_chat():
  data = request.get_json()
  if not data or not all(key in data for key in ['cid', 'recipe']):
    return jsonify({'message': 'Missing data: recipe, cid'}), 400
  cid = data.get('cid')
  recipe = data.get('recipe')
  workflow = StateGraph(state_schema=MessagesState)

  def call_model(state: MessagesState):
    response = model.invoke(state["messages"])
    return {"messages": response}
  workflow.add_edge(START, "model")
  workflow.add_node("model", call_model)

  memory = MemorySaver()
  app = workflow.compile(checkpointer=memory)

  config = {"configurable": {"thread_id": "abc123"}}

  instructions=(
  f"For the following recipe in json... {recipe}, analyze it"
  "Try to teach the recipe to the user step by step in a conversational style"
  "So do not try to teach all in one go"
  "youll will first introduce yourself, describe the recipe"
  "then the user will say next step"
  "you will converse the first step in the instruction"
  "then the user will say next step"
  "you will converse the next step"
  "you will rinse and repeat this until the user has finished the recipe"
  "if the user wants to go back to the recipe, they will say to go back to a instructio number or describe the instruction"
  "then, you will find the step and reexplain the step in a conversational style"
  "after that, you will ask the user if you want to go back to the current step")
  model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
  
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

# # import getpass
# # import os
# # from dotenv import load_dotenv
# # from langchain_core.messages import HumanMessage, SystemMessage
# # from langgraph.checkpoint.sqlite import SqliteSaver
# # from langgraph.graph import START, MessagesState, StateGraph
# # from langchain_google_genai import ChatGoogleGenerativeAI
# # import sqlite3
# # from flask import Blueprint, request, jsonify, send_file, current_app
# # from gtts import gTTS
# # import io
# # import time
# # from pydub import AudioSegment
# # from utils.voice import stt, stt_stream
# # from utils.supabase import supabase

# # load_dotenv()

# # # Prompt for Google API key if not set
# # if not os.environ.get("GOOGLE_API_KEY"):
# #     os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

# # chat_bp = Blueprint('chat', __name__)
# # model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)
# # workflow = StateGraph(state_schema=MessagesState)

# # def call_model(state: MessagesState):
# #     response = model.invoke(state["messages"])
# #     return {"messages": response}

# # workflow.add_edge(START, "model")
# # workflow.add_node("model", call_model)

# # conn = sqlite3.connect("conversations.db", check_same_thread=False)
# # memory = SqliteSaver(conn=conn)
# # app = workflow.compile(checkpointer=memory)

# # # -------------------- ROUTES -------------------- #

# # @chat_bp.route("/create_chat", methods=["POST"])
# # def create_chat():
# #     data = request.get_json()
# #     if not data or not all(key in data for key in ['rid', 'uid', 'recipe']):
# #         return jsonify({'message': 'Missing data: recipe, uid, rid'}), 400

# #     uid = data.get('uid')
# #     rid = data.get('rid')

# #     try:
# #         response = supabase.table("conversations").insert({
# #             "user_id": uid,
# #             "recipe_id": rid,
# #             "state": 1  # initialize state
# #         }).execute()
# #         cid = response.data[0]['chat_id']

# #         recipes_response = supabase.table('recipes').select('*').eq('id', rid).single().execute()
# #         recipe = recipes_response.data
# #     except Exception as e:
# #         return jsonify({'message': f'Database error: {str(e)}'}), 500

# #     instructions = (
# #         f"For the following recipe in json: {recipe}, analyze it. "
# #         "You will introduce yourself, describe the recipe, and help the user with any questions "
# #         "outside the predefined steps (like ingredient alternatives, mistakes, or clarifications)."
# #     )

# #     initial_messages = [
# #         SystemMessage(content=instructions),
# #         HumanMessage(content="Hi! Please start teaching me the recipe.")
# #     ]

# #     config = {"configurable": {"thread_id": cid}}
# #     first_response = app.invoke({"messages": initial_messages}, config)

# #     mp3_fp = io.BytesIO()
# #     try:
# #         tts = gTTS(first_response["messages"][-1].content, lang='en')
# #         tts.write_to_fp(mp3_fp)
# #     except Exception:
# #         return jsonify({"message": "Speech could not be generated"}), 500

# #     mp3_fp.seek(0)
# #     return send_file(
# #         mp3_fp,
# #         mimetype='audio/mpeg',
# #         as_attachment=True,
# #         download_name='intro.mp3'
# #     ), 200

# # # -------------------- Full audio chat -------------------- #
# # @chat_bp.route("/chat", methods=["POST"])
# # def chat():
# #     cid = request.form.get('cid')
# #     if 'audio' not in request.files or not cid:
# #         return jsonify({'message': 'Missing data: audio file or cid'}), 400

# #     file = request.files['audio']
# #     try:
# #         userAudio = AudioSegment.from_file(file)
# #         userAudio = userAudio.set_frame_rate(16000).set_channels(1)
# #         buffer = io.BytesIO()
# #         userAudio.export(buffer, format="raw")
# #         userAudioBytes = buffer.getvalue()
# #     except Exception:
# #         return jsonify({'message': 'Could not process audio file.'}), 500

# #     try:
# #         userMessage = stt(userAudioBytes)
# #     except Exception:
# #         return jsonify({'message': 'Speech-to-text failed'}), 500

# #     try:
# #         chat_response = supabase.table('conversations').select('*').eq('chat_id', cid).single().execute()
# #         chat = chat_response.data
# #         rid = chat['recipe_id']
# #         uid = chat['user_id']

# #         recipes_response = supabase.table('recipes').select('*').eq('id', rid).single().execute()
# #         recipe = recipes_response.data
# #     except Exception as e:
# #         return jsonify({'message': f'Database error: {str(e)}'}), 500

# #     # Ensure state exists
# #     chat_state = chat.get('state', 1)
# #     chat_message = ""

# #     if "next" in userMessage.lower():
# #         if chat_state >= len(recipe['ai_instructions']['ai_steps']):
# #             chat_message = "The recipe has been completed. Please feel free to restart or check other recipes."
# #         else:
# #             chat_message = recipe['ai_instructions']['ai_steps'][chat_state]['description']
# #             supabase.table('conversations').update({'state': chat_state + 1}).eq('chat_id', cid).execute()
# #     elif "previous" in userMessage.lower():
# #         if chat_state <= 1:
# #             chat_message = "You are on the first step. You cannot go back any further."
# #         else:
# #             chat_message = recipe['ai_instructions']['ai_steps'][chat_state - 2]['description']
# #     elif "repeat" in userMessage.lower():
# #         if chat_state <= 1:
# #             chat_message = "We have not started yet, please say next to continue."
# #         else:
# #             chat_message = recipe['ai_instructions']['ai_steps'][chat_state - 1]['description']
# #     else:
# #         config = {"configurable": {"thread_id": cid}}
# #         start_time = time.perf_counter()
# #         response = app.invoke({"messages": [HumanMessage(content=userMessage)]}, config)
# #         end_time = time.perf_counter()
# #         print(f"Model response time: {end_time - start_time:.6f}s")
# #         chat_message = response["messages"][-1].content

# #     # Generate TTS
# #     wav_fp = io.BytesIO()
# #     try:
# #         tts = gTTS(chat_message, lang='en')
# #         tts.write_to_fp(wav_fp)
# #     except Exception:
# #         return jsonify({"message": "Speech could not be generated"}), 500

# #     wav_fp.seek(0)
# #     return send_file(
# #         wav_fp,
# #         mimetype='audio/mpeg',
# #         as_attachment=True,
# #         download_name='response.mp3'
# #     ), 200

# # # -------------------- Streaming audio chat -------------------- #
# # @chat_bp.route("/chat_stream", methods=["POST"])
# # def chat_stream():
# #     cid = request.form.get('cid')
# #     if 'audio' not in request.files or not cid:
# #         return jsonify({'message': 'Missing data: audio file or cid'}), 400

# #     file = request.files['audio']
# #     try:
# #         # Load audio, convert to mono 16kHz
# #         userAudio = AudioSegment.from_file(file)
# #         userAudio = userAudio.set_frame_rate(16000).set_channels(1)
# #         buffer = io.BytesIO()
# #         userAudio.export(buffer, format="raw")
# #         audio_bytes = buffer.getvalue()

# #         # Split audio into chunks (~100ms)
# #         CHUNK_SIZE = 3200  # 16kHz mono, 16-bit PCM -> 2 bytes/sample
# #         raw_chunks = [audio_bytes[i:i+CHUNK_SIZE] for i in range(0, len(audio_bytes), CHUNK_SIZE)]

# #         # Only keep chunks with amplitude above threshold
# #         threshold_db = -40  # dBFS threshold, adjust as needed
# #         chunks_to_send = []
# #         for chunk in raw_chunks:
# #             segment = AudioSegment(
# #                 chunk,
# #                 sample_width=2,  # 16-bit PCM
# #                 frame_rate=16000,
# #                 channels=1
# #             )
# #             if segment.dBFS > threshold_db:
# #                 chunks_to_send.append(chunk)

# #         if not chunks_to_send:
# #             return jsonify({'message': 'No speech detected above threshold'}), 200

# #     except Exception as e:
# #         return jsonify({'message': f'Could not process audio file: {str(e)}'}), 500

# #     # Stream chunks to STT
# #     transcript = stt_stream(chunks_to_send, rate=16000)

# #     # Generate AI response
# #     config = {"configurable": {"thread_id": cid}}
# #     response = app.invoke({"messages": [HumanMessage(content=transcript)]}, config)

# #     # TTS
# #     wav_fp = io.BytesIO()
# #     try:
# #         tts = gTTS(response["messages"][-1].content, lang='en')
# #         tts.write_to_fp(wav_fp)
# #     except Exception:
# #         return jsonify({"message": "Speech could not be generated"}), 500

# #     wav_fp.seek(0)
# #     return send_file(
# #         wav_fp,
# #         mimetype='audio/mpeg',
# #         as_attachment=True,
# #         download_name='response.mp3'
# #     ), 200

# # # -------------------- File upload -------------------- #
# # @chat_bp.route('/upload', methods=['POST'])
# # def upload_file():
# #     if 'audio' not in request.files:
# #         return jsonify({'error': 'No audio file'}), 400

# #     file = request.files['audio']
# #     if file.filename == '':
# #         return jsonify({'error': 'No audio file selected'}), 400

# #     save_path = os.path.join(current_app.config.get('UPLOAD_FOLDER', './uploads'), file.filename)
# #     os.makedirs(os.path.dirname(save_path), exist_ok=True)

# #     try:
# #         file.save(save_path)
# #         return jsonify({'message': 'File uploaded successfully', 'filename': file.filename}), 200
# #     except Exception as e:
# #         return jsonify({'error': f'Failed to save file: {str(e)}'}), 500


# # import getpass
# # import os
# # from dotenv import load_dotenv
# # from langchain_core.messages import HumanMessage, SystemMessage
# # # from langgraph.checkpoint.memory import MemorySaver
# # from langgraph.checkpoint.sqlite import SqliteSaver
# # from langgraph.graph import START, MessagesState, StateGraph
# # from langchain_google_genai import ChatGoogleGenerativeAI
# # import sqlite3
# # from flask import Blueprint, request, jsonify, send_file, Response,current_app
# # from gtts import gTTS
# # from utils.voice import stt
# # import io
# # import json
# # import time
# # from pydub import AudioSegment
# # from utils.supabase import supabase
# # load_dotenv()

# # if not os.environ.get("GOOGLE_API_KEY"):
# #   os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

# # chat_bp = Blueprint('chat', __name__)
# # model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)
# # workflow = StateGraph(state_schema=MessagesState)


# # def call_model(state: MessagesState):
# #   response = model.invoke(state["messages"])
# #   return {"messages": response}

# # workflow.add_edge(START, "model")
# # workflow.add_node("model", call_model)

# # conn = sqlite3.connect("conversations.db", check_same_thread=False)

# # memory = SqliteSaver(conn=conn)

# # app = workflow.compile(checkpointer=memory)


# # @chat_bp.route("/create_chat", methods=["POST"])
# # def create_chat():
# #   data = request.get_json()
# #   if not data or not all(key in data for key in ['rid', 'uid', 'recipe']):
# #     return jsonify({'message': 'Missing data: recipe, uid, rid'}), 400
# #   uid=data.get('uid')
# #   rid=data.get('rid')
  

# #   response = (
# #       supabase.table("conversations")
# #       .insert({
# #         "user_id":uid,
# #         "recipe_id":rid,
# #       })
# #       .execute()
# #   )
  
# #   data=response.data[0]
# #   cid=data['chat_id']
# #   config = {"configurable": {"thread_id": cid}}
# #   recipes_response = (
# #       supabase.table('recipes')
# #       .select('*')
# #       .eq('id', rid)
# #       .single()
# #       .execute()
# #   )
# #   recipe=recipes_response.data
# #   # print(str(recipe))

# #   instructions=(
# #   f"For the following recipe in json... {recipe}, analyze it"
# #   "youll will first introduce yourself, describe the recipe"
# #   "then user will be transversing through the instructions as the" \
# #   "but that isnt your responasbility as the"
# #   "code has prerecorded messages for each step and"
# #   "keywords to signify when to go to the next step, previous step, or to repeat a step"
# #   "your focus is outside of that where you are gonna help the user when they have issues"
# #   "like providing ingredient alternatives, when they mess up, confusion clarification, etc"
# #   "you will be given the user step for context etc")
  
# #   initial_messages = [
# #       SystemMessage(content=instructions),
# #       HumanMessage(content="Hi! Please start teaching me the recipe.")
# #   ]

# #   first_response = app.invoke({"messages": initial_messages}, config)
# #   mp3_fp = io.BytesIO()
# #   try:
# #     tts = gTTS(first_response["messages"][-1].content, lang='en')
# #     tts.write_to_fp(mp3_fp)
# #   except Exception as e:
# #     return jsonify({"message":"Speech could not be generated"}), 500
  
# #   mp3_fp.seek(0)
  
# #   return send_file(
# #     mp3_fp,
# #     mimetype='audio/mpeg',
# #     as_attachment=True,
# #     download_name='intro.mp3'
# #   ), 200

# # @chat_bp.route("/chat", methods=["POST"])
# # def chat():


# #   cid = request.form.get('cid')
# #   if 'audio' not in request.files or not cid:
# #     return jsonify({'message': 'Missing data: audio file or cid'}), 400
# #   file=request.files['audio']


# #   try:
# #     userAudio = AudioSegment.from_file(file)
# #     userAudio = userAudio.set_frame_rate(16000)
# #     userAudio = userAudio.set_channels(1)
# #     buffer = io.BytesIO()
# #     userAudio.export(buffer, format="raw")
# #     userAudioBytes = buffer.getvalue()


# #   except Exception as e:
# #       return jsonify({'message': 'Could not process audio file.'}), 500

# #   userMessage = stt(userAudioBytes)
# #   print('-----------------------------------')
# #   print(userMessage)
# #   chat_response = (
# #       supabase.table('conversations')
# #       .select('*')
# #       .eq('chat_id', cid)
# #       .single()
# #       .execute()
# #   )
# #   chat=chat_response.data
# #   rid=chat['recipe_id']
# #   uid=chat['user_id']

# #   recipes_response = (
# #       supabase.table('recipes')
# #       .select('*')
# #       .eq('id', rid)
# #       .single()
# #       .execute()
# #   )
# #   recipe=recipes_response.data
# #   chat_message=""
# #   print(userMessage)
# #   if "next" in userMessage:
# #     if(chat['state']>=len(recipe['ai_instructions']['ai_steps'])):
# #       chat_message="The recipe has been completed. Please feel free to restart or checkout other recipes."
# #     else:
# #       chat_message=recipe['ai_instructions']['ai_steps'][chat['state']]['description']
# #       update_response = (
# #         supabase.table('conversations')
# #         .update({'state':(chat['state']+1)})  
# #         .eq('chat_id', cid)
# #         .execute()
# #       )
# #   elif "previous" in userMessage:
# #     if(chat['state']<=1):
# #       chat_message="You are on the first step. You cannot got back any further"
# #     else:
# #       chat_message=recipe['ai_instructions']['ai_steps'][chat['state']-2]['description']
# #   elif "repeat" in userMessage:
# #     if(chat['state']==1):
# #       chat_message="We have not started yet, please say next to continue"
# #     else:  
# #       chat_message=recipe['ai_instructions']['ai_steps'][chat['state']-1]['description']
# #   else:
# #     config = {"configurable": {"thread_id": cid}}
# #     start_time = time.perf_counter()
# #     response = app.invoke({"messages": [HumanMessage(content=userMessage)]}, config)
# #     end_time = time.perf_counter()


# #     duration = end_time - start_time
# #     print(f"The code took {duration:.6f} seconds to run.")
# #     chat_message=response["messages"][-1].content
# #   try:
# #     wav_fp = io.BytesIO()
# #     tts = gTTS(chat_message, lang='en')
# #     tts.write_to_fp(wav_fp)
# #   except Exception as e:
# #     return jsonify({"message":"Speech could not be generated"}), 500
  
# #   wav_fp.seek(0)
  
# #   return send_file(
# #     wav_fp,
# #     mimetype='audio/wav',
# #     as_attachment=True,
# #     download_name='response.wav'
# #   ), 200
  

# # @chat_bp.route('/upload',methods=['POST'])
# # def upload_file():
# #   if 'audio' not in request.files:
# #     return jsonify({'error':'no audio file'}), 400
# #   file=request.files['audio']

# #   if file.filename=='':
# #     return jsonify({'error':'no audio file selected'}), 400
  
# #   if file:
# #     print(file.filename)
# #     save_path= os.path.join(current_app.config['UPLOAD_FOLDER'],file.filename)
# #     try:
# #       file.save(save_path)

# #       return jsonify({
# #         'message': 'File uploaded successfully',
# #         'filename': file.filename
# #       }), 200
# #     except Exception as e:
# #         return jsonify({'error': f'Failed to save file: {str(e)}'}), 500

# #   return jsonify({'error': 'Unknown error'}), 500

# import getpass
# import os
# from dotenv import load_dotenv
# from langchain_core.messages import HumanMessage, SystemMessage
# from langgraph.checkpoint.sqlite import SqliteSaver
# from langgraph.graph import START, MessagesState, StateGraph
# from langchain_google_genai import ChatGoogleGenerativeAI
# import sqlite3
# from flask import Blueprint, request, jsonify, send_file, current_app
# from flask_socketio import emit
# from gtts import gTTS
# import io
# import time
# from pydub import AudioSegment
# from utils.voice import stt, stt_stream, stt_stream_realtime
# from utils.supabase import supabase
# import base64
# import traceback

# load_dotenv()

# # Prompt for Google API key if not set
# if not os.environ.get("GOOGLE_API_KEY"):
#     os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

# chat_bp = Blueprint('chat', __name__)
# model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)
# workflow = StateGraph(state_schema=MessagesState)

# def call_model(state: MessagesState):
#     response = model.invoke(state["messages"])
#     return {"messages": response}

# workflow.add_edge(START, "model")
# workflow.add_node("model", call_model)

# conn = sqlite3.connect("conversations.db", check_same_thread=False)
# memory = SqliteSaver(conn=conn)
# app = workflow.compile(checkpointer=memory)

# # Store active streaming sessions
# active_sessions = {}

# # -------------------- HTTP ROUTES -------------------- #

# @chat_bp.route("/create_chat", methods=["POST"])
# def create_chat():
#     data = request.get_json()
#     if not data or not all(key in data for key in ['rid', 'uid', 'recipe']):
#         return jsonify({'message': 'Missing data: recipe, uid, rid'}), 400

#     uid = data.get('uid')
#     rid = data.get('rid')

#     try:
#         response = supabase.table("conversations").insert({
#             "user_id": uid,
#             "recipe_id": rid,
#             "state": 1
#         }).execute()
#         cid = response.data[0]['chat_id']

#         recipes_response = supabase.table('recipes').select('*').eq('id', rid).single().execute()
#         recipe = recipes_response.data
#     except Exception as e:
#         return jsonify({'message': f'Database error: {str(e)}'}), 500

#     instructions = (
#         f"For the following recipe in json: {recipe}, analyze it. "
#         "You will introduce yourself, describe the recipe, and help the user with any questions "
#         "outside the predefined steps (like ingredient alternatives, mistakes, or clarifications)."
#     )

#     initial_messages = [
#         SystemMessage(content=instructions),
#         HumanMessage(content="Hi! Please start teaching me the recipe.")
#     ]

#     config = {"configurable": {"thread_id": cid}}
#     first_response = app.invoke({"messages": initial_messages}, config)

#     mp3_fp = io.BytesIO()
#     try:
#         tts = gTTS(first_response["messages"][-1].content, lang='en')
#         tts.write_to_fp(mp3_fp)
#     except Exception:
#         return jsonify({"message": "Speech could not be generated"}), 500

#     mp3_fp.seek(0)
#     return send_file(
#         mp3_fp,
#         mimetype='audio/mpeg',
#         as_attachment=True,
#         download_name='intro.mp3'
#     ), 200

# @chat_bp.route("/chat", methods=["POST"])
# def chat():
#     cid = request.form.get('cid')
#     if 'audio' not in request.files or not cid:
#         return jsonify({'message': 'Missing data: audio file or cid'}), 400

#     file = request.files['audio']
#     try:
#         userAudio = AudioSegment.from_file(file)
#         userAudio = userAudio.set_frame_rate(16000).set_channels(1)
#         buffer = io.BytesIO()
#         userAudio.export(buffer, format="raw")
#         userAudioBytes = buffer.getvalue()
#     except Exception:
#         return jsonify({'message': 'Could not process audio file.'}), 500

#     try:
#         userMessage = stt(userAudioBytes)
#     except Exception:
#         return jsonify({'message': 'Speech-to-text failed'}), 500

#     try:
#         chat_response = supabase.table('conversations').select('*').eq('chat_id', cid).single().execute()
#         chat = chat_response.data
#         rid = chat['recipe_id']
#         uid = chat['user_id']

#         recipes_response = supabase.table('recipes').select('*').eq('id', rid).single().execute()
#         recipe = recipes_response.data
#     except Exception as e:
#         return jsonify({'message': f'Database error: {str(e)}'}), 500

#     chat_state = chat.get('state', 1)
#     chat_message = ""

#     if "next" in userMessage.lower():
#         if chat_state >= len(recipe['ai_instructions']['ai_steps']):
#             chat_message = "The recipe has been completed. Please feel free to restart or check other recipes."
#         else:
#             chat_message = recipe['ai_instructions']['ai_steps'][chat_state]['description']
#             supabase.table('conversations').update({'state': chat_state + 1}).eq('chat_id', cid).execute()
#     elif "previous" in userMessage.lower():
#         if chat_state <= 1:
#             chat_message = "You are on the first step. You cannot go back any further."
#         else:
#             chat_message = recipe['ai_instructions']['ai_steps'][chat_state - 2]['description']
#     elif "repeat" in userMessage.lower():
#         if chat_state <= 1:
#             chat_message = "We have not started yet, please say next to continue."
#         else:
#             chat_message = recipe['ai_instructions']['ai_steps'][chat_state - 1]['description']
#     else:
#         config = {"configurable": {"thread_id": cid}}
#         start_time = time.perf_counter()
#         response = app.invoke({"messages": [HumanMessage(content=userMessage)]}, config)
#         end_time = time.perf_counter()
#         print(f"Model response time: {end_time - start_time:.6f}s")
#         chat_message = response["messages"][-1].content

#     wav_fp = io.BytesIO()
#     try:
#         tts = gTTS(chat_message, lang='en')
#         tts.write_to_fp(wav_fp)
#     except Exception:
#         return jsonify({"message": "Speech could not be generated"}), 500

#     wav_fp.seek(0)
#     return send_file(
#         wav_fp,
#         mimetype='audio/mpeg',
#         as_attachment=True,
#         download_name='response.mp3'
#     ), 200

# @chat_bp.route("/chat_stream", methods=["POST"])
# def chat_stream():
#     cid = request.form.get('cid')
#     if 'audio' not in request.files or not cid:
#         return jsonify({'message': 'Missing data: audio file or cid'}), 400

#     file = request.files['audio']
#     try:
#         userAudio = AudioSegment.from_file(file)
#         userAudio = userAudio.set_frame_rate(16000).set_channels(1)
#         buffer = io.BytesIO()
#         userAudio.export(buffer, format="raw")
#         audio_bytes = buffer.getvalue()

#         CHUNK_SIZE = 3200
#         raw_chunks = [audio_bytes[i:i+CHUNK_SIZE] for i in range(0, len(audio_bytes), CHUNK_SIZE)]

#         threshold_db = -40
#         chunks_to_send = []
#         for chunk in raw_chunks:
#             segment = AudioSegment(
#                 chunk,
#                 sample_width=2,
#                 frame_rate=16000,
#                 channels=1
#             )
#             if segment.dBFS > threshold_db:
#                 chunks_to_send.append(chunk)

#         if not chunks_to_send:
#             return jsonify({'message': 'No speech detected above threshold'}), 200

#     except Exception as e:
#         return jsonify({'message': f'Could not process audio file: {str(e)}'}), 500

#     transcript = stt_stream(chunks_to_send, rate=16000)

#     config = {"configurable": {"thread_id": cid}}
#     response = app.invoke({"messages": [HumanMessage(content=transcript)]}, config)

#     wav_fp = io.BytesIO()
#     try:
#         tts = gTTS(response["messages"][-1].content, lang='en')
#         tts.write_to_fp(wav_fp)
#     except Exception:
#         return jsonify({"message": "Speech could not be generated"}), 500

#     wav_fp.seek(0)
#     return send_file(
#         wav_fp,
#         mimetype='audio/mpeg',
#         as_attachment=True,
#         download_name='response.mp3'
#     ), 200

# @chat_bp.route('/upload', methods=['POST'])
# def upload_file():
#     if 'audio' not in request.files:
#         return jsonify({'error': 'No audio file'}), 400

#     file = request.files['audio']
#     if file.filename == '':
#         return jsonify({'error': 'No audio file selected'}), 400

#     save_path = os.path.join(current_app.config.get('UPLOAD_FOLDER', './uploads'), file.filename)
#     os.makedirs(os.path.dirname(save_path), exist_ok=True)

#     try:
#         file.save(save_path)
#         return jsonify({'message': 'File uploaded successfully', 'filename': file.filename}), 200
#     except Exception as e:
#         return jsonify({'error': f'Failed to save file: {str(e)}'}), 500

# # -------------------- WEBSOCKET HANDLERS -------------------- #

# def register_socketio_handlers(socketio):
#     """Register all WebSocket event handlers"""
    
#     @socketio.on('connect')
#     def handle_connect():
#         print(f'Client connected: {request.sid}')
#         emit('connection_response', {'status': 'connected'})

#     @socketio.on('disconnect')
#     def handle_disconnect():
#         print(f'Client disconnected: {request.sid}')
#         if request.sid in active_sessions:
#             del active_sessions[request.sid]

#     @socketio.on('start_stream')
#     def handle_start_stream(data):
#         """Initialize streaming session"""
#         cid = data.get('cid')
#         if not cid:
#             emit('error', {'message': 'Missing conversation ID'})
#             return
        
#         active_sessions[request.sid] = {
#             'cid': cid,
#             'audio_chunks': [],
#             'is_streaming': True
#         }
#         print(f'Started stream for session {request.sid}, cid: {cid}')
#         emit('stream_started', {'status': 'ready'})

#     @socketio.on('audio_chunk')
#     def handle_audio_chunk(data):
#         if request.sid not in active_sessions:
#             emit('error', {'message': 'No active session'})
#             return
        
#         try:
#             audio_bytes = base64.b64decode(data['chunk'])
            
#             # IMPORTANT: Check if chunk is empty
#             if len(audio_bytes) == 0:
#                 print(f"[AUDIO_CHUNK] WARNING: Empty chunk received")
#                 return
            
#             active_sessions[request.sid]['audio_chunks'].append(audio_bytes)
#             chunk_count = len(active_sessions[request.sid]['audio_chunks'])
            
#             # Log every 5 chunks
#             if chunk_count % 5 == 0:
#                 total_bytes = sum(len(c) for c in active_sessions[request.sid]['audio_chunks'])
#                 print(f"[AUDIO_CHUNK] Session {request.sid}: {chunk_count} chunks, {total_bytes} bytes total")
            
#             emit('chunk_received', {'count': chunk_count})
            
#         except Exception as e:
#             print(f'[AUDIO_CHUNK] ERROR: {str(e)}')
#             traceback.print_exc()
#             emit('error', {'message': f'Error processing audio: {str(e)}'})


#     @socketio.on('stop_stream')
#     def handle_stop_stream():
#         """Process accumulated audio and generate response"""
#         print(f"\n{'='*60}")
#         print(f"[STOP_STREAM] Received stop_stream event from {request.sid}")
        
#         if request.sid not in active_sessions:
#             print(f"[STOP_STREAM] ERROR: No active session for {request.sid}")
#             emit('error', {'message': 'No active session'})
#             return
        
#         session = active_sessions[request.sid]
#         cid = session['cid']
#         audio_chunks = session['audio_chunks']
        
#         print(f"[STOP_STREAM] CID: {cid}")
#         print(f"[STOP_STREAM] Chunks received: {len(audio_chunks)}")
        
#         if not audio_chunks:
#             print(f"[STOP_STREAM] ERROR: No audio chunks")
#             emit('error', {'message': 'No audio data received'})
#             return
        
#         # Log total audio size
#         total_bytes = sum(len(chunk) for chunk in audio_chunks)
#         print(f"[STOP_STREAM] Total audio: {total_bytes} bytes ({total_bytes/32000:.2f} seconds)")
        
#         try:
#             # Perform STT
#             print(f"[STOP_STREAM] Starting transcription...")
#             emit('processing', {'status': 'transcribing'})
            
#             transcript = stt_stream_realtime(audio_chunks, rate=16000)
#             print(f"[STOP_STREAM] Transcription result: '{transcript}'")
            
#             if not transcript:
#                 print(f"[STOP_STREAM] WARNING: Empty transcript")
#                 emit('transcript', {'text': '', 'message': 'No speech detected'})
#                 return
            
#             emit('transcript', {'text': transcript})
#             print(f"[STOP_STREAM] Transcript emitted")
            
#             # Fetch recipe context
#             print(f"[STOP_STREAM] Fetching conversation data...")
#             try:
#                 chat_response = supabase.table('conversations').select('*').eq('chat_id', cid).single().execute()
#                 chat = chat_response.data
#                 rid = chat['recipe_id']
                
#                 print(f"[STOP_STREAM] Recipe ID: {rid}")
                
#                 recipes_response = supabase.table('recipes').select('*').eq('id', rid).single().execute()
#                 recipe = recipes_response.data
#                 print(f"[STOP_STREAM] Recipe loaded: {recipe.get('title', 'Unknown')}")
                
#             except Exception as e:
#                 print(f"[STOP_STREAM] DATABASE ERROR: {str(e)}")
#                 traceback.print_exc()
#                 emit('error', {'message': f'Database error: {str(e)}'})
#                 return
            
#             chat_state = chat.get('state', 1)
#             chat_message = ""
            
#             print(f"[STOP_STREAM] Current state: {chat_state}")
#             print(f"[STOP_STREAM] Processing command/query...")
            
#             # Handle navigation commands
#             if "next" in transcript.lower():
#                 print(f"[STOP_STREAM] Command: NEXT")
#                 if chat_state >= len(recipe['ai_instructions']['ai_steps']):
#                     chat_message = "The recipe has been completed. Please feel free to restart or check other recipes."
#                 else:
#                     chat_message = recipe['ai_instructions']['ai_steps'][chat_state]['description']
#                     supabase.table('conversations').update({'state': chat_state + 1}).eq('chat_id', cid).execute()
                    
#             elif "previous" in transcript.lower():
#                 print(f"[STOP_STREAM] Command: PREVIOUS")
#                 if chat_state <= 1:
#                     chat_message = "You are on the first step. You cannot go back any further."
#                 else:
#                     chat_message = recipe['ai_instructions']['ai_steps'][chat_state - 2]['description']
                    
#             elif "repeat" in transcript.lower():
#                 print(f"[STOP_STREAM] Command: REPEAT")
#                 if chat_state <= 1:
#                     chat_message = "We have not started yet, please say next to continue."
#                 else:
#                     chat_message = recipe['ai_instructions']['ai_steps'][chat_state - 1]['description']
#             else:
#                 # Use chatbot
#                 print(f"[STOP_STREAM] Using AI chatbot...")
#                 emit('processing', {'status': 'generating_response'})
#                 config = {"configurable": {"thread_id": cid}}
                
#                 response = app.invoke(
#                     {"messages": [HumanMessage(content=transcript)]}, 
#                     config
#                 )
#                 chat_message = response["messages"][-1].content
#                 print(f"[STOP_STREAM] AI response: {chat_message[:100]}...")
            
#             print(f"[STOP_STREAM] Generating TTS...")
#             emit('processing', {'status': 'generating_audio'})
            
#             audio_fp = io.BytesIO()
#             tts = gTTS(chat_message, lang='en')
#             tts.write_to_fp(audio_fp)
#             audio_fp.seek(0)
            
#             print(f"[STOP_STREAM] TTS generated, size: {len(audio_fp.getvalue())} bytes")
            
#             # Convert to base64 for transmission
#             audio_b64 = base64.b64encode(audio_fp.read()).decode('utf-8')
#             print(f"[STOP_STREAM] Base64 encoded, length: {len(audio_b64)}")
            
#             emit('response', {
#                 'text': chat_message,
#                 'audio': audio_b64,
#                 'format': 'mp3'
#             })
            
#             print(f"[STOP_STREAM] ✓ Response emitted successfully")
#             print(f"{'='*60}\n")
            
#         except Exception as e:
#             print(f"[STOP_STREAM] ✗ EXCEPTION: {type(e).__name__}: {str(e)}")
#             traceback.print_exc()
#             emit('error', {'message': f'Processing error: {str(e)}'})
#         finally:
#             # Clean up session
#             print(f"[STOP_STREAM] Cleaning up session")
#             active_sessions[request.sid]['audio_chunks'] = []

import getpass
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI
import sqlite3
from flask import Blueprint, request, jsonify, send_file, current_app
from flask_socketio import emit
from gtts import gTTS
import io
import time
from pydub import AudioSegment
from utils.voice import stt, stt_stream, stt_stream_realtime
from utils.supabase import supabase
import base64
import traceback

load_dotenv()

# Prompt for Google API key if not set
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

# Store active streaming sessions
active_sessions = {}

# HARDCODED CID FOR TESTING
HARDCODED_CID = "test12345"

# -------------------- HTTP ROUTES -------------------- #

@chat_bp.route("/create_chat", methods=["POST"])
def create_chat():
    data = request.get_json()
    if not data or not all(key in data for key in ['rid', 'uid', 'recipe']):
        return jsonify({'message': 'Missing data: recipe, uid, rid'}), 400

    uid = data.get('uid')
    rid = data.get('rid')

    try:
        response = supabase.table("conversations").insert({
            "user_id": uid,
            "recipe_id": rid,
            "state": 1
        }).execute()
        cid = response.data[0]['chat_id']

        recipes_response = supabase.table('recipes').select('*').eq('id', rid).single().execute()
        recipe = recipes_response.data
    except Exception as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500

    instructions = (
        f"For the following recipe in json: {recipe}, analyze it. "
        "You will introduce yourself, describe the recipe, and help the user with any questions "
        "outside the predefined steps (like ingredient alternatives, mistakes, or clarifications)."
    )

    initial_messages = [
        SystemMessage(content=instructions),
        HumanMessage(content="Hi! Please start teaching me the recipe.")
    ]

    config = {"configurable": {"thread_id": cid}}
    first_response = app.invoke({"messages": initial_messages}, config)

    mp3_fp = io.BytesIO()
    try:
        tts = gTTS(first_response["messages"][-1].content, lang='en')
        tts.write_to_fp(mp3_fp)
    except Exception:
        return jsonify({"message": "Speech could not be generated"}), 500

    mp3_fp.seek(0)
    return send_file(
        mp3_fp,
        mimetype='audio/mpeg',
        as_attachment=True,
        download_name='intro.mp3'
    ), 200

@chat_bp.route("/chat", methods=["POST"])
def chat():
    # return jsonify({"uplaoded":"true"})
    cid = request.form.get('cid')
    if 'audio' not in request.files or not cid:
        return jsonify({'message': 'Missing data: audio file or cid'}), 400

    file = request.files['audio']
    try:
        userAudio = AudioSegment.from_file(file)
        userAudio = userAudio.set_frame_rate(16000).set_channels(1)
        buffer = io.BytesIO()
        userAudio.export(buffer, format="raw")
        userAudioBytes = buffer.getvalue()
    except Exception:
        return jsonify({'message': 'Could not process audio file.'}), 500

    try:
        userMessage = stt(userAudioBytes)
    except Exception:
        return jsonify({'message': 'Speech-to-text failed'}), 500

    try:
        chat_response = supabase.table('conversations').select('*').eq('chat_id', cid).single().execute()
        chat = chat_response.data
        rid = chat['recipe_id']
        uid = chat['user_id']

        recipes_response = supabase.table('recipes').select('*').eq('id', rid).single().execute()
        recipe = recipes_response.data
    except Exception as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500

    chat_state = chat.get('state', 1)
    chat_message = ""

    if "next" in userMessage.lower():
        if chat_state >= len(recipe['ai_instructions']['ai_steps']):
            chat_message = "The recipe has been completed. Please feel free to restart or check other recipes."
        else:
            chat_message = recipe['ai_instructions']['ai_steps'][chat_state]['description']
            supabase.table('conversations').update({'state': chat_state + 1}).eq('chat_id', cid).execute()
    elif "previous" in userMessage.lower():
        if chat_state <= 1:
            chat_message = "You are on the first step. You cannot go back any further."
        else:
            chat_message = recipe['ai_instructions']['ai_steps'][chat_state - 2]['description']
    elif "repeat" in userMessage.lower():
        if chat_state <= 1:
            chat_message = "We have not started yet, please say next to continue."
        else:
            chat_message = recipe['ai_instructions']['ai_steps'][chat_state - 1]['description']
    else:
        config = {"configurable": {"thread_id": cid}}
        start_time = time.perf_counter()
        response = app.invoke({"messages": [HumanMessage(content=userMessage)]}, config)
        end_time = time.perf_counter()
        print(f"Model response time: {end_time - start_time:.6f}s")
        chat_message = response["messages"][-1].content

    wav_fp = io.BytesIO()
    try:
        tts = gTTS(chat_message, lang='en')
        tts.write_to_fp(wav_fp)
    except Exception:
        return jsonify({"message": "Speech could not be generated"}), 500

    wav_fp.seek(0)
    return send_file(
        wav_fp,
        mimetype='audio/mpeg',
        as_attachment=True,
        download_name='response.mp3'
    ), 200

@chat_bp.route("/ping")
def ping():
    return jsonify({"message": "pong"}), 200

@chat_bp.route("/chat_stream", methods=["POST"])
def chat_stream():
    cid = request.form.get('cid')
    if 'audio' not in request.files or not cid:
        return jsonify({'message': 'Missing data: audio file or cid'}), 400

    file = request.files['audio']
    try:
        userAudio = AudioSegment.from_file(file)
        userAudio = userAudio.set_frame_rate(16000).set_channels(1)
        buffer = io.BytesIO()
        userAudio.export(buffer, format="raw")
        audio_bytes = buffer.getvalue()

        CHUNK_SIZE = 3200
        raw_chunks = [audio_bytes[i:i+CHUNK_SIZE] for i in range(0, len(audio_bytes), CHUNK_SIZE)]

        threshold_db = -40
        chunks_to_send = []
        for chunk in raw_chunks:
            segment = AudioSegment(
                chunk,
                sample_width=2,
                frame_rate=16000,
                channels=1
            )
            if segment.dBFS > threshold_db:
                chunks_to_send.append(chunk)

        if not chunks_to_send:
            return jsonify({'message': 'No speech detected above threshold'}), 200

    except Exception as e:
        return jsonify({'message': f'Could not process audio file: {str(e)}'}), 500

    transcript = stt_stream(chunks_to_send, rate=16000)

    config = {"configurable": {"thread_id": cid}}
    response = app.invoke({"messages": [HumanMessage(content=transcript)]}, config)

    wav_fp = io.BytesIO()
    try:
        tts = gTTS(response["messages"][-1].content, lang='en')
        tts.write_to_fp(wav_fp)
    except Exception:
        return jsonify({"message": "Speech could not be generated"}), 500

    wav_fp.seek(0)
    return send_file(
        wav_fp,
        mimetype='audio/mpeg',
        as_attachment=True,
        download_name='response.mp3'
    ), 200

@chat_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file'}), 400

    file = request.files['audio']
    if file.filename == '':
        return jsonify({'error': 'No audio file selected'}), 400

    save_path = os.path.join(current_app.config.get('UPLOAD_FOLDER', './uploads'), file.filename)
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    try:
        file.save(save_path)
        return jsonify({'message': 'File uploaded successfully', 'filename': file.filename}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to save file: {str(e)}'}), 500

# -------------------- WEBSOCKET HANDLERS -------------------- #

def register_socketio_handlers(socketio):
    """Register all WebSocket event handlers"""
    
    @socketio.on('connect')
    def handle_connect():
        print(f'[WebSocket] Client connected: {request.sid}')
        emit('connection_response', {'status': 'connected'})

    @socketio.on('disconnect')
    def handle_disconnect():
        print(f'[WebSocket] Client disconnected: {request.sid}')
        if request.sid in active_sessions:
            del active_sessions[request.sid]

    @socketio.on('start_stream')
    def handle_start_stream(data):
        """Initialize streaming session - uses hardcoded CID"""
        # Use hardcoded CID instead of client-provided
        cid = HARDCODED_CID
        
        active_sessions[request.sid] = {
            'cid': cid,
            'audio_chunks': [],
            'is_streaming': True
        }
        print(f'[WebSocket] ✓ Started stream for session {request.sid}, cid: {cid} (HARDCODED)')
        emit('stream_started', {'status': 'ready', 'cid': cid})

    @socketio.on('audio_chunk')
    def handle_audio_chunk(data):
        """Receive audio chunk from client"""
        if request.sid not in active_sessions:
            print(f'[WebSocket] ✗ No active session for {request.sid}')
            emit('error', {'message': 'No active session'})
            return
        
        try:
            audio_bytes = base64.b64decode(data['chunk'])
            
            # Check if chunk is empty
            if len(audio_bytes) == 0:
                print(f"[AUDIO_CHUNK] WARNING: Empty chunk received")
                return
            
            active_sessions[request.sid]['audio_chunks'].append(audio_bytes)
            chunk_count = len(active_sessions[request.sid]['audio_chunks'])
            
            # Log every 5 chunks
            if chunk_count % 5 == 0:
                total_bytes = sum(len(c) for c in active_sessions[request.sid]['audio_chunks'])
                print(f"[AUDIO_CHUNK] Session {request.sid}: {chunk_count} chunks, {total_bytes} bytes total")
            
            emit('chunk_received', {'count': chunk_count})
            
        except Exception as e:
            print(f'[AUDIO_CHUNK] ✗ ERROR: {str(e)}')
            traceback.print_exc()
            emit('error', {'message': f'Error processing audio: {str(e)}'})

    @socketio.on('stop_stream')
    def handle_stop_stream():
        """Process accumulated audio and generate response"""
        print(f"\n{'='*60}")
        print(f"[STOP_STREAM] Received stop_stream event from {request.sid}")
        
        if request.sid not in active_sessions:
            print(f"[STOP_STREAM] ✗ ERROR: No active session for {request.sid}")
            emit('error', {'message': 'No active session'})
            return
        
        session = active_sessions[request.sid]
        cid = session['cid']
        audio_chunks = session['audio_chunks']
        
        print(f"[STOP_STREAM] CID: {cid} (HARDCODED)")
        print(f"[STOP_STREAM] Chunks received: {len(audio_chunks)}")
        
        if not audio_chunks:
            print(f"[STOP_STREAM] ✗ ERROR: No audio chunks")
            emit('error', {'message': 'No audio data received'})
            return
        
        # Log total audio size
        total_bytes = sum(len(chunk) for chunk in audio_chunks)
        print(f"[STOP_STREAM] Total audio: {total_bytes} bytes ({total_bytes/32000:.2f} seconds)")
        
        try:
            # Perform STT
            print(f"[STOP_STREAM] Starting transcription...")
            emit('processing', {'status': 'transcribing'})
            
            transcript = stt_stream_realtime(audio_chunks, rate=16000)
            print(f"[STOP_STREAM] Transcription result: '{transcript}'")
            
            if not transcript:
                print(f"[STOP_STREAM] ⚠ WARNING: Empty transcript")
                emit('transcript', {'text': '', 'message': 'No speech detected'})
                return
            
            emit('transcript', {'text': transcript})
            print(f"[STOP_STREAM] Transcript emitted")
            
            # Generate AI response (WITHOUT recipe context for testing)
            print(f"[STOP_STREAM] Generating AI response...")
            emit('processing', {'status': 'generating_response'})
            
            config = {"configurable": {"thread_id": cid}}
            response = app.invoke(
                {"messages": [HumanMessage(content=transcript)]}, 
                config
            )
            
            ai_message = response["messages"][-1].content
            print(f"[STOP_STREAM] AI response: {ai_message[:100]}...")
            
            # Generate TTS
            print(f"[STOP_STREAM] Generating TTS...")
            emit('processing', {'status': 'generating_audio'})
            
            audio_fp = io.BytesIO()
            tts = gTTS(ai_message, lang='en')
            tts.write_to_fp(audio_fp)
            audio_fp.seek(0)
            
            print(f"[STOP_STREAM] TTS generated, size: {len(audio_fp.getvalue())} bytes")
            
            # Convert to base64 for transmission
            audio_b64 = base64.b64encode(audio_fp.read()).decode('utf-8')
            print(f"[STOP_STREAM] Base64 encoded, length: {len(audio_b64)}")
            
            emit('response', {
                'text': ai_message,
                'audio': audio_b64,
                'format': 'mp3'
            })
            
            print(f"[STOP_STREAM] ✓ Response emitted successfully")
            print(f"{'='*60}\n")
            
        except Exception as e:
            print(f"[STOP_STREAM] ✗ EXCEPTION: {type(e).__name__}: {str(e)}")
            traceback.print_exc()
            emit('error', {'message': f'Processing error: {str(e)}'})
        finally:
            # Clean up session
            print(f"[STOP_STREAM] Cleaning up session")
            active_sessions[request.sid]['audio_chunks'] = []

    @socketio.on('test_audio')
    def test_audio(data):
        """Simple test endpoint"""
        try:
            print("[TEST] Received test audio")
            audio_b64 = data['audio']
            audio_bytes = base64.b64decode(audio_b64)
            
            print(f"[TEST] Audio size: {len(audio_bytes)} bytes")
            
            # Test STT
            transcript = stt(audio_bytes)
            print(f"[TEST] Transcript: {transcript}")
            
            # Test TTS
            audio_fp = io.BytesIO()
            tts = gTTS(f"You said: {transcript}", lang='en')
            tts.write_to_fp(audio_fp)
            audio_fp.seek(0)
            
            response_b64 = base64.b64encode(audio_fp.read()).decode('utf-8')
            
            emit('test_response', {
                'transcript': transcript,
                'audio': response_b64
            })
            
            print("[TEST] ✓ Success")
            
        except Exception as e:
            print(f"[TEST] ✗ Error: {str(e)}")
            traceback.print_exc()
            emit('error', {'message': str(e)})
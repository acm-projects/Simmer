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

from utils.auth import authorize_user
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
  "then user will be transversing through the instructions" \
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
  user_id, error_response, status_code = authorize_user()
  if error_response:
    return error_response, status_code

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

@chat_bp.route("/ping", methods=["GET"])
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

import base64
import traceback
from threading import Thread
from flask_socketio import emit

# Store active streaming sessions
active_sessions = {}
HARDCODED_CID = "test12345"

def process_audio_chunk(audio_bytes, sid):
    session = active_sessions.get(sid)
    if not session or not session.get("is_streaming", False):
        print(f"[PROCESS_CHUNK] Session {sid} is no longer streaming, skipping chunk")
        return

    try:
        # Calculate loudness of the audio chunk
        audio_segment = AudioSegment(
            audio_bytes,
            sample_width=2,  # 16-bit = 2 bytes
            frame_rate=16000,  # Assuming 16kHz sample rate
            channels=1  # Mono
        )
        
        amplitude = audio_segment.dBFS
        
        if amplitude == float('-inf'):
            print(f"[PROCESS_CHUNK] Session {sid}: Chunk of {len(audio_bytes)} bytes - SILENT")
        else:
            # Create visual bar (60 dBFS is very quiet, 0 dBFS is max)
            bar_length = int((60 + amplitude) / 2)
            bar_length = max(0, min(bar_length, 30))  # Clamp between 0-30
            bar = "#" * bar_length
            
            print(f"[PROCESS_CHUNK] Session {sid}: {len(audio_bytes)} bytes | {amplitude:.1f} dBFS | {bar}")
        
    except Exception as e:
        print(f"[PROCESS_CHUNK] ✗ Error processing chunk for {sid}: {e}")
        traceback.print_exc()


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
        """Initialize streaming session"""
        cid = HARDCODED_CID
        active_sessions[request.sid] = {
            'cid': cid,
            'audio_chunks': [],
            'is_streaming': True
        }
        print(f'[WebSocket] ✓ Started stream for session {request.sid}, cid: {cid}')
        emit('stream_started', {'status': 'ready', 'cid': cid})

    @socketio.on('audio_chunk')
    def handle_audio_chunk(data):
        """Receive audio chunk from client and process immediately"""
        if request.sid not in active_sessions:
            print(f'[WebSocket] ✗ No active session for {request.sid}')
            emit('error', {'message': 'No active session'})
            return

        try:
            audio_bytes = base64.b64decode(data['chunk'])
            session = active_sessions[request.sid]
            session['audio_chunks'].append(audio_bytes)
            chunk_count = len(session['audio_chunks'])
            print(f"[AUDIO_CHUNK] Session {request.sid}: Chunk received ({chunk_count} total)")
            
            # Process chunk asynchronously
            Thread(target=process_audio_chunk, args=(audio_bytes, request.sid)).start()

            emit('chunk_received', {'count': chunk_count})
        except Exception as e:
            print(f'[AUDIO_CHUNK] ✗ ERROR: {str(e)}')
            traceback.print_exc()
            emit('error', {'message': f'Error processing audio: {str(e)}'})

    @socketio.on('stop_stream')
    def handle_stop_stream():
        """Stop streaming session and log info"""
        if request.sid not in active_sessions:
            print(f"[STOP_STREAM] ✗ No active session for {request.sid}")
            emit('error', {'message': 'No active session'})
            return

        session = active_sessions[request.sid]
        audio_chunks = session['audio_chunks']
        print(f"[STOP_STREAM] Session {request.sid} stopped. Total chunks: {len(audio_chunks)}")
        total_bytes = sum(len(c) for c in audio_chunks)
        print(f"[STOP_STREAM] Total audio size: {total_bytes} bytes")
        emit('stop_stream_confirm', {'chunks_received': len(audio_chunks)})

        # Clean up session
        session['audio_chunks'] = []
        session['is_streaming'] = False
        print(f"[STOP_STREAM] Session {request.sid} cleaned up")

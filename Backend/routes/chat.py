import getpass
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
# from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI
import sqlite3
from flask import Blueprint, request, jsonify, send_file, Response, current_app
from gtts import gTTS
from utils.voice import stt, stt_stream
import io
import json
from pydub import AudioSegment

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

# -------------------- ROUTES -------------------- #

@chat_bp.route("/create_chat", methods=["POST"])
def create_chat():
    data = request.get_json()
    if not data or not all(key in data for key in ['cid', 'recipe']):
        return jsonify({'message': 'Missing data: recipe, cid'}), 400
    cid = data.get('cid')
    recipe = data.get('recipe')

    config = {"configurable": {"thread_id": cid}}

    instructions = (
        f"For the following recipe in json... {recipe}, analyze it. "
        "Try to teach the recipe to the user step by step in a conversational style. "
        "So do not try to teach all in one go. "
        "You will first introduce yourself, describe the recipe, then the user will say next step. "
        "You will converse the first step in the instruction, then the user will say next step, "
        "you will converse the next step, rinse and repeat until the user finishes the recipe. "
        "If the user wants to go back to the recipe, they will say to go back to a instruction number or describe the instruction. "
        "Then, you will find the step and reexplain the step conversationally. "
        "After that, you will ask the user if they want to go back to the current step."
    )

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
        return jsonify({"message": "Speech could not be generated"}), 500

    mp3_fp.seek(0)
    return send_file(
        mp3_fp,
        mimetype='audio/mpeg',
        as_attachment=True,
        download_name='intro.mp3'
    ), 200

# -------------------- Full audio chat -------------------- #
@chat_bp.route("/chat", methods=["POST"])
def chat():
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
    except Exception as e:
        return jsonify({'message': 'Could not process audio file.'}), 500

    userMessage = stt(userAudioBytes)
    config = {"configurable": {"thread_id": cid}}

    response = app.invoke({"messages": [HumanMessage(content=userMessage)]}, config)
    wav_fp = io.BytesIO()
    try:
        tts = gTTS(response["messages"][-1].content, lang='en')
        tts.write_to_fp(wav_fp)
    except Exception as e:
        return jsonify({"message": "Speech could not be generated"}), 500

    wav_fp.seek(0)
    return send_file(
        wav_fp,
        mimetype='audio/wav',
        as_attachment=True,
        download_name='response.wav'
    ), 200

# -------------------- Streaming audio chat -------------------- #
@chat_bp.route("/chat_stream", methods=["POST"])
def chat_stream():
    cid = request.form.get('cid')
    if 'audio' not in request.files or not cid:
        return jsonify({'message': 'Missing data: audio file or cid'}), 400

    file = request.files['audio']

    try:
        # Convert to 16kHz mono raw audio
        userAudio = AudioSegment.from_file(file)
        userAudio = userAudio.set_frame_rate(16000).set_channels(1)
        buffer = io.BytesIO()
        userAudio.export(buffer, format="raw")
        audio_bytes = buffer.getvalue()

        # Split audio into chunks for streaming
        CHUNK_SIZE = 3200  # ~100ms at 16kHz mono
        audio_chunks = [audio_bytes[i:i+CHUNK_SIZE] for i in range(0, len(audio_bytes), CHUNK_SIZE)]
    except Exception as e:
        return jsonify({'message': 'Could not process audio file.'}), 500

    # Stream audio to Google STT
    transcript = stt_stream(audio_chunks, rate=16000)

    # Generate AI response
    config = {"configurable": {"thread_id": cid}}
    response = app.invoke({"messages": [HumanMessage(content=transcript)]}, config)

    # Convert AI response to speech
    wav_fp = io.BytesIO()
    try:
        tts = gTTS(response["messages"][-1].content, lang='en')
        tts.write_to_fp(wav_fp)
    except Exception as e:
        return jsonify({"message": "Speech could not be generated"}), 500

    wav_fp.seek(0)
    return send_file(
        wav_fp,
        mimetype='audio/wav',
        as_attachment=True,
        download_name='response.wav'
    ), 200

# -------------------- File upload -------------------- #
@chat_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'audio' not in request.files:
        return jsonify({'error': 'no audio file'}), 400
    file = request.files['audio']

    if file.filename == '':
        return jsonify({'error': 'no audio file selected'}), 400

    save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
    try:
        file.save(save_path)
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': file.filename
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to save file: {str(e)}'}), 500

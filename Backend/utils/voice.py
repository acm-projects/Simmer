import os
from gtts import gTTS
from google.oauth2 import service_account
from google.cloud import speech
from google.cloud import texttospeech
import pyaudio

current_dir = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(current_dir, '..', 'sttKey.json')
credentials = service_account.Credentials.from_service_account_file(key_path)
client = speech.SpeechClient(credentials=credentials)
clientSpeaker = texttospeech.TextToSpeechClient(credentials=credentials)
voice = texttospeech.VoiceSelectionParams(
    language_code="en-US", name="Archenar"
)
audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3
)


# fileName= path to recording file (will switch for streaming later)

def stt(audio_data):
    # with open(fileName,"rb") as file:
    #     audio_data = file.read()
    
    audio = speech.RecognitionAudio(content=audio_data)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US"
    )

    response = client.recognize(config=config, audio=audio)
    transcript = ""
    transcript += " ".join([result.alternatives[0].transcript for result in response.results])
    return transcript

def speak(words):
    tts = gTTS(words)
    tts.save("recipe.mp3")

def speaks(text):
    synthesis_input = texttospeech.SynthesisInput(text=text)
    response = clientSpeaker.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    with open("output.mp3", "wb") as out:
        # Write the response to the output file.
        out.write(response.audio_content)
        print('Audio content written to file "output.mp3"')

# Audio recording parameters
RATE = 41000
CHUNK = int(RATE / 10)  # 100ms

# #Testing for backend streaming
# def microphone_stream():
#     """Generator that yields raw audio chunks from the microphone."""
#     p = pyaudio.PyAudio()
#     stream = p.open(
#         format=pyaudio.paInt16,
#         channels=1,
#         rate=RATE,
#         input=True,
#         frames_per_buffer=CHUNK
#     )
#     print("🎤 Listening... (Ctrl+C to stop)\n")
#     try:
#         while True:
#             data = stream.read(CHUNK, exception_on_overflow=False)
#             yield data
#     except KeyboardInterrupt:
#         print("\n🛑 Stopped listening.")
#     finally:
#         stream.stop_stream()
#         stream.close()
#         p.terminate()

# #streaming
# def stt_live_pyaudio():
#     """Stream microphone audio to Google Cloud Speech-to-Text API."""
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=RATE,
#         language_code="en-US"
#     )
#     streaming_config = speech.StreamingRecognitionConfig(
#         config=config,
#         interim_results=True
#     )

#     # Convert the raw audio chunks into request objects
#     requests = (
#         speech.StreamingRecognizeRequest(audio_content=chunk)
#         for chunk in microphone_stream()
#     )

#     responses = client.streaming_recognize(
#         config=streaming_config,
#         requests=requests
#     )

#     # Handle streaming responses in real time
#     try:
#         for response in responses:
#             for result in response.results:
#                 if result.is_final:
#                     print("Final:", result.alternatives[0].transcript)
#                 else:
#                     print("Interim:", result.alternatives[0].transcript, end="\r")
#     except KeyboardInterrupt:
#         print("\n🛑 Exiting...")

# stt_live_pyaudio()

# RATE = 41000

# client = speech.SpeechClient()

def stt_stream(audio_chunks, rate=RATE):
    """Streams audio chunks to Google Cloud Speech-to-Text API."""
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=rate,
        language_code="en-US"
    )

    streaming_config = speech.StreamingRecognitionConfig(
        config=config,
        interim_results=True,
        single_utterance=True
    )

    # Convert generator of raw bytes → request objects
    requests = (
        speech.StreamingRecognizeRequest(audio_content=chunk)
        for chunk in audio_chunks
    )

    responses = client.streaming_recognize(
        config=streaming_config,
        requests=requests
    )

    transcript = ""
    for response in responses:
        for result in response.results:
            if result.is_final:
                transcript += result.alternatives[0].transcript + " "
                print("Final:", result.alternatives[0].transcript)
            else:
                print("Interim:", result.alternatives[0].transcript, end="\r")

    return transcript.strip()
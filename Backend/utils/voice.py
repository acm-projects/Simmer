import os
from gtts import gTTS
from google.oauth2 import service_account
from google.cloud import speech

current_dir = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(current_dir, '..', 'sttKey.json')
credentials = service_account.Credentials.from_service_account_file(key_path)
client = speech.SpeechClient(credentials=credentials)
#fileName= path to recording file (will switch for streaming later)

def stt(audio_data):
    # with open(fileName,"rb") as file:
    #     audio_data = file.read()
    
    audio = speech.RecognitionAudio(content=audio_data)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=41000,
        language_code="en-US"
    )

    response = client.recognize(config=config, audio=audio)
    transcript = ""
    transcript += " ".join([result.alternatives[0].transcript for result in response.results])
    return transcript

def speak(words):
    tts = gTTS(words)
    tts.save("recipe.mp3")
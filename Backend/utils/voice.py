import os
from gtts import gTTS
from google.oauth2 import service_account
from google.cloud import speech
from dotenv import load_dotenv
import requests
import json
import urllib
from googleapiclient.discovery import build
from google.cloud import texttospeech

load_dotenv()
SCRAPECREATORS_API_KEY : str = os.environ.get("SCRAPECREATORS_KEY")
YOUTUBE_API_KEY: str = os.environ.get("YOUTUBE_API_KEY")

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
def speaks(text):
    synthesis_input = texttospeech.SynthesisInput(text=text)
    response = clientSpeaker.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    with open("output.mp3", "wb") as out:
        # Write the response to the output file.
        out.write(response.audio_content)
        print('Audio content written to file "output.mp3"')

# speaks("To make the perfect cake, the first step is to mix all of the dry ingredients.")

voices = clientSpeaker.list_voices()

for v in voices.voices:
    print(v.name)
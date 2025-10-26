import os
from gtts import gTTS
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound
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

def generateYoutubeRecipe(url):
    if "v=" in url:
        videoId = url.split("v=")[-1]
    elif "shorts/" in url:
        videoId = url.split("shorts/")[-1]
    print("Video: " + videoId)
    videoId = videoId.split("&")[0]
    print(videoId)

    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

    try:
        transcriptMachine = YouTubeTranscriptApi()
        fetchedTranscript = transcriptMachine.fetch(video_id=videoId)
        transcript = ""
        for snippet in fetchedTranscript:
            transcript=transcript + snippet.text + "\n"
        video_response = youtube.videos().list(
            part="snippet",
            id=videoId
        ).execute()
        description = ""
        if "items" in video_response and len(video_response["items"]) > 0:
            snippet = video_response["items"][0]["snippet"]
            description = snippet.get("description", "")
        else:
            print("No video details found.")
        return {
            "description": description,
            "transcript": transcript
        }
    except NoTranscriptFound:
        print("No Transcripts")
    except Exception as e:
        print("Error:")


def generateInstaRecipe(url):
    encodedString = urllib.parse.quote(url,safe="")
    urlTranscript = f"https://api.scrapecreators.com/v2/instagram/media/transcript?url={encodedString}"
    headers = {
        "x-api-key": SCRAPECREATORS_API_KEY
    }

    urlDescription = f"https://api.scrapecreators.com/v1/instagram/post?url={encodedString}"
    responseTranscript = requests.get(urlTranscript, headers=headers)
    responseDescription = requests.get(urlDescription, headers=headers)
    dataTranscript = responseTranscript.json()
    dataDescription = responseDescription.json()
    transcript = {}
    if ("transcripts" in dataTranscript.keys()):
        transcript["Recipe: "] = dataTranscript["transcripts"][0]["text"]
    else:
        for i in range(0,len(dataTranscript.keys())-2):
            if dataTranscript[f"{i}"]["text"]!=None:
                transcript[f"Recipe{i}"] = dataTranscript[f"{i}"]["text"]
    transcript["Description"] = dataDescription["data"]["xdt_shortcode_media"]["edge_media_to_caption"]["edges"][0]["node"]["text"]
    return transcript

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
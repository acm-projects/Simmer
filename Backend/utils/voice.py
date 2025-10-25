import os
from gtts import gTTS
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound
from google.oauth2 import service_account
from google.cloud import speech
from dotenv import load_dotenv
import requests
import json
import urllib

load_dotenv()
SCRAPECREATORS_API_KEY : str = os.environ.get("SCRAPECREATORS_KEY")

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
        sample_rate_hertz=16000,
        language_code="en-US"
    )

    response = client.recognize(config=config, audio=audio)

    transcript = " ".join([result.alternatives[0].transcript for result in response.results])
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

    try:
        transcriptMachine = YouTubeTranscriptApi()
        fetchedTranscript = transcriptMachine.fetch(video_id=videoId)
        transcript = ""
        for snippet in fetchedTranscript:
            transcript=transcript + snippet.text + "\n"
        return transcript
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

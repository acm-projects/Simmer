from gtts import gTTS
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound
import os
from google.oauth2 import service_account
from google.cloud import speech

credentials = service_account.Credentials.from_service_account_file("PathToKeyFile")
client = speech.SpeechClient(credentials=credentials)

#fileName= path to recording file (will switch for streaming later)
def stt(fileName):
    with open(fileName,"rb") as file:
        audio_data = file.read()
    
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

def generateRecipe():
    url = input("Youtube Video Link: ")
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
        with open("recipe.txt","w") as file:
            file.write(transcript)
            # speak(text)
        with open("recipe.txt", "r") as file:
            text = file.read()
            speak(text)
        # os.remove("recipe.txt")
    except NoTranscriptFound:
        print("No Transcripts")
    except Exception as e:
        print("Error:")

    print(transcript)
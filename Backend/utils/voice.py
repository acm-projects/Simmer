from gtts import gTTS
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound
def speak(words):
    tts = gTTS(words)
    tts.save("recipe.mp3")

# speak("Hello World")
def generateRecipe():
    url = input("Youtube Video Link: ")
    if (url.find("v=")):
        videoId = url.split("v=")[-1]
    else:
        videoId = url.split("/")[-1]
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
    except NoTranscriptFound:
        print("No Transcripts")
    except Exception as e:
        print("Error:")

    print(transcript)
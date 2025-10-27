import os
import requests
from bs4 import BeautifulSoup
import urllib, urllib.parse
from urllib.parse import urlparse
from utils.createRecipe import generate_blog_transcript_and_caption
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound
from dotenv import load_dotenv
from googleapiclient.discovery import build

load_dotenv()
SCRAPECREATORS_API_KEY: str = os.environ.get("SCRAPECREATORS_KEY")
YOUTUBE_API_KEY: str = os.environ.get("YOUTUBE_API_KEY")

def generate_recipe_from_tiktok(url: str):
    try:
        encoded_url = urllib.parse.quote(url, safe="")
        api_url = f'https://api.scrapecreators.com/v2/tiktok/video?url={encoded_url}&get_transcript=true'
        headers = {'x-api-key': SCRAPECREATORS_API_KEY}
        response = requests.get(api_url, headers=headers)

        if response.status_code != 200:
            print('Transcript fetch failed:', response.text)
            return None

        data = response.json()
        aweme_detail = data.get('aweme_detail', {})
        transcript = data.get('transcript', '')
        caption = aweme_detail.get('desc', '')

        if not caption:
            print('No caption found.')
            return None
        if not transcript:
            print('Finding Transcript')
            api_url = f'https://api.scrapecreators.com/v1/tiktok/video/transcript?url={encoded_url}'
            transcript_response = requests.get(api_url, headers=headers)

            if transcript_response.status_code != 200:
                print('Transcript fetch failed: ', transcript_response.text)

            transcript_data = transcript_response.json()
            transcript = transcript_data.get('transcript', "")

            if not transcript_data:
                print('No transcript found in API Response.')
                return None
            
        results = {
            'caption' : caption,
            'transcript' : transcript
        }
        return results
    
    except Exception as e:
        print("Error:", e)
        return None

def generate_recipe_from_youtube(url: str):
    if 'v=' in url:
        videoId = url.split('v=')[-1]
    elif 'shorts/' in url:
        videoId = url.split('shorts/')[-1]
    print('Video: ' + videoId)
    videoId = videoId.split('&')[0]
    print(videoId)

    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

    try:
        transcriptMachine = YouTubeTranscriptApi()
        fetchedTranscript = transcriptMachine.fetch(video_id=videoId)
        transcript = ''
        for snippet in fetchedTranscript:
            transcript=transcript + snippet.text + '\n'
        video_response = youtube.videos().list(
            part='snippet',
            id=videoId
        ).execute()
        description = ''
        if 'items' in video_response and len(video_response['items']) > 0:
            snippet = video_response['items'][0]['snippet']
            description = snippet.get('description', '')
        else:
            print('No video details found.')

        results = {
            'caption': description,
            'transcript': transcript
        }
        return results
    except NoTranscriptFound:
        print("No Transcripts")
        return None
    except Exception as e:
        print("Error:")
        return None

def generate_recipe_from_instagram(url: str):
    encodedString = urllib.parse.quote(url,safe='')
    urlTranscript = f'https://api.scrapecreators.com/v2/instagram/media/transcript?url={encodedString}'
    headers = {
        'x-api-key': SCRAPECREATORS_API_KEY
    }

    urlDescription = f'https://api.scrapecreators.com/v1/instagram/post?url={encodedString}'
    responseTranscript = requests.get(urlTranscript, headers=headers)
    responseDescription = requests.get(urlDescription, headers=headers)
    dataTranscript = responseTranscript.json()
    dataDescription = responseDescription.json()
    results = {}
    if ('transcripts' in dataTranscript.keys()):
        results['transcript'] = dataTranscript['transcripts'][0]['text']
    else:
        return None
        # for i in range(0,len(dataTranscript.keys())-2):
        #     if dataTranscript[f"{i}"]["text"]!=None:
        #         transcript[f"Recipe{i}"] = dataTranscript[f"{i}"]["text"]
    results['caption'] = dataDescription['data']['xdt_shortcode_media']['edge_media_to_caption']['edges'][0]['node']['text']
    return results

def generate_recipe_from_blog(url: str):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string.strip() if soup.title else 'Untitled Recipe'

        paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
        lists = [li.get_text(strip=True) for li in soup.find_all("li")]
        text_content = '\n'.join(paragraphs + lists)

        ai_generated = generate_blog_transcript_and_caption(
            title=title, text=text_content
        )

        return {
            'transcript': ai_generated.get('transcript', ''),
            'caption': ai_generated.get('caption', '')
        }

    except Exception as e:
        print(f'Error scraping blog: {e}')
        return None

PLATFORM_HANDLERS = {
    'tiktok.com' : generate_recipe_from_tiktok,
    'instagram.com' : generate_recipe_from_instagram,
    'youtube.com' : generate_recipe_from_youtube,
    'youtu.be' : generate_recipe_from_youtube
}

def get_url_data(url: str):
    domain = urlparse(url).netloc.lower()
    try:
        for key, handler in PLATFORM_HANDLERS.items():
            if key in domain:
                return handler(url)
        return generate_recipe_from_blog(url)
    except Exception as e:
        print(f'Error processing {domain}: {e}')
        return None
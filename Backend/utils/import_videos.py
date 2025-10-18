import os
import json
import requests
import urllib.parse
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GEMINI_API_KEY : str = os.environ.get("GOOGLE_API_KEY")
SCRAPECREATORS_API_KEY : str = os.environ.get("SCRAPECREATORS_KEY")

genai.configure(api_key=GEMINI_API_KEY)      

def generate_recipe_from_tiktok(video_url):
    try:

        encoded_url = urllib.parse.quote(video_url, safe="")
        api_url = f'https://api.scrapecreators.com/v2/tiktok/video?url={encoded_url}&get_transcript=true'
        headers = {
            'x-api-key' : SCRAPECREATORS_API_KEY
        }
        response = requests.get(api_url, headers=headers)

        if response.status_code != 200:
            print('Transcript fetch failed:', response.text)
            return

        data = response.json()
        aweme_detail = data.get('aweme_detail', {})
        transcript = data.get('transcript', '')
        caption = aweme_detail.get('desc', '')

        if not caption:
            print('No caption found.')

        if not transcript:
            print('No transcript found in API Response.')
            return
        
        model = genai.GenerativeModel('gemini-2.5-flash')

        prompt = f'''
        You are a cooking assistant. Analyze this cooking transcript and respective caption from a TikTok video and turn it into a structure recipe JSON ONLY.
        Make reasonable assumptions about prep and cook time if not stated.
        Fill out the ingredients in the JSON based on the caption. Make sure the quantity and unit fields match what is in the caption.
        If caption is empty and/or doesn't list ingredients, infer ingredient list based on context of the transcript.

        Transcript:
        {transcript}

        Caption:
        {caption}

        Strictly output *only* the recipe JSON is this format (no markdown, no extra text):

        {{
          "title": "",
          "description": "",
          "instructions": {{
            "steps": [
              {{"step": 1, "description": ""}}
            ]
          }},
          "prep_time": 0,
          "cook_time": 0,
          "dietary_tags": [],
          "ingredients": [
            {{"name": "", "quantity": "", "unit": "", "is_allergen": false}}
          ]
        }}
        '''

        gemini_response = model.generate_content(prompt)
        recipe_text = gemini_response.text.strip()

        try:
            if recipe_text.startswith('```'):
                recipe_text = recipe_text.strip('` \n').replace('json\n', '')

            recipe_json = json.loads(recipe_text)
            print(json.dumps(recipe_json, indent=2))
            return recipe_json

        except json.JSONDecodeError:
            print('Could not parse JSON, showing raw Gemini output instead:\n')
            print(recipe_text)
            return recipe_text

    except Exception as e:
        print('Error: ', e)

if __name__ == "__main__":
    generate_recipe_from_tiktok("https://www.tiktok.com/t/ZTMaanTGB/")
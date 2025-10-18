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
        api_url = f"https://api.scrapecreators.com/v1/tiktok/video/transcript?url={encoded_url}"
        headers = {
            "x-api-key" : SCRAPECREATORS_API_KEY
        }
        transcript_response = requests.get(api_url, headers=headers)

        if transcript_response.status_code != 200:
            print("Transcript fetch failed:", transcript_response.text)
            return

        transcript_data = transcript_response.json()
        transcript = transcript_data.get("transcript", "")

        if not transcript:
            print("No transcript found in API Response.")
            return
        
        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""
        You are a cooking assistant. Analyze this cooking transcript from a TikTok video and turn it into a structure recipe JSON ONLY.
        Make reasonable assumptions about prep and cook time if not stated.
        Infer the ingredients list based on the context and instructions provided in the transcript.

        Transcript:
        {transcript}

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
        
        """
        gemini_response = model.generate_content(prompt)
        recipe_text = gemini_response.text.strip()

        try:
            if recipe_text.startswith("```"):
                recipe_text = recipe_text.strip("` \n").replace("json\n", "")

            recipe_json = json.loads(recipe_text)
            print(json.dumps(recipe_json, indent=2))
            return recipe_json

        except json.JSONDecodeError:
            print("Could not parse JSON, showing raw Gemini output instead:\n")
            print(recipe_text)
            return recipe_text

    except Exception as e:
        print("Error: ", e)

if __name__ == "__main__":
    generate_recipe_from_tiktok("https://www.tiktok.com/t/ZTMPY9Yyq/")
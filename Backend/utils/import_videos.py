import os
import json
import requests
import urllib.parse
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.messages import HumanMessage
from pydantic import BaseModel, Field
from typing import List

load_dotenv()
GEMINI_API_KEY: str = os.environ.get("GOOGLE_API_KEY")
SCRAPECREATORS_API_KEY: str = os.environ.get("SCRAPECREATORS_KEY")

class InstructionStep(BaseModel):
    step: int
    description: str

class Instructions(BaseModel):
    steps: List[InstructionStep]

class Ingredient(BaseModel):
    name: str
    quantity: str
    unit: str
    is_allergen: bool

class Recipe(BaseModel):
    title: str
    description: str
    instructions: Instructions
    prep_time: int
    cook_time: int
    dietary_tags: List[str]
    ingredients: List[Ingredient]

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2,
    google_api_key=GEMINI_API_KEY
)

parser = PydanticOutputParser(pydantic_object=Recipe)

def generate_recipe_from_tiktok(video_url: str):
    try:
        encoded_url = urllib.parse.quote(video_url, safe="")
        api_url = f'https://api.scrapecreators.com/v2/tiktok/video?url={encoded_url}&get_transcript=true'
        headers = {'x-api-key': SCRAPECREATORS_API_KEY}
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
            print('Finding Transcript')
            api_url = f'https://api.scrapecreators.com/v1/tiktok/video/transcript?url={encoded_url}'
            transcript_response = requests.get(api_url, headers=headers)

            if transcript_response.status_code != 200:
                print('Transcript fetch failed: ', transcript_response.text)

            transcript_data = transcript_response.json()
            transcript = transcript_data.get('transcript', "")

            if not transcript_data:
                print('No transcript found in API Response.')
                return

        prompt = ChatPromptTemplate.from_template('''
            You are a cooking assistant. Given the following TikTok transcript and caption,
            generate a structured recipe object in strict JSON format matching this schema:
            {format_instructions}
                                                  
            Fill out the ingredients in the JSON solele based on the caption. Make sure the quantity and unit fields match what is in the caption, but infer is_allergen attributes.
            If caption is empty and/or doesn't list ingredients, infer ingredient list based on context of the transcript.
            Ingredient quantities MUST be strictly numerical, so if quantity is not explicity stated in the caption, infer the quantity and respective unit.

            Transcript:
            {transcript}

            Caption:
            {caption}

            Include reasonable prep_time and cook_time estimates and steps.
            ''')
        
        final_prompt = prompt.format_messages(
            transcript = transcript,
            caption = caption,
            format_instructions = parser.get_format_instructions()
        )

        response = llm.invoke(final_prompt)
        recipe = parser.parse(response.content)
        print(json.dumps(recipe.model_dump(), indent=2))
        return recipe.model_dump()

    except Exception as e:
        print("Error:", e)
        return None

if __name__ == "__main__":
    generate_recipe_from_tiktok("https://www.tiktok.com/t/ZTMaanTGB/")
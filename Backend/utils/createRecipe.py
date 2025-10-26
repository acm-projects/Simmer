import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel
from typing import List

load_dotenv()
GEMINI_API_KEY: str = os.environ.get("GOOGLE_API_KEY")

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
    ai_instructions: Instructions
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

def createRecipe(data):
  try:
    prompt = ChatPromptTemplate.from_template('''
        You are a cooking assistant. Given the following transcript and caption,
        generate a structured recipe object in strict JSON format matching this schema:
        {format_instructions}
                                                    
        Fill out the ingredients in the JSON solely based on the caption. Make sure the quantity and unit fields match what is in the caption, but infer is_allergen attributes.
        If caption is empty and/or doesn't list ingredients, infer ingredient list based on context of the transcript.
        Ingredient quantities MUST be strictly numerical, so if quantity is not explicity stated in the caption, infer the quantity and respective unit.
        Please also provide descriptions for the ai_instructions attribute and make these descriptions as conversational and humanized as possbile.

        Transcript:
        {transcript}

        Caption:
        {caption}

        Include reasonable prep_time and cook_time estimates and steps.
    ''')

    transcript = data.get('transcript')
    caption = data.get('caption')
          
    final_prompt = prompt.format_messages(
      transcript = transcript,
      caption = caption,
      format_instructions = parser.get_format_instructions()
    )

    response = llm.invoke(final_prompt)
    recipe = parser.parse(response.content)
    print(json.dumps(recipe.model_dump(), indent=2))
    return recipe.model_dump_json(indent=2)
  
  except Exception as e:
    print("Error:", e)
    return None
import os
import re
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.schema import SystemMessage, HumanMessage
from pydantic import BaseModel
from flask import request, jsonify 
from werkzeug.utils import secure_filename
from postgrest.exceptions import APIError as AuthApiError
import uuid
from utils.supabase import supabase
from typing import List

load_dotenv()
GEMINI_API_KEY: str = os.environ.get("GOOGLE_API_KEY")

class InstructionStep(BaseModel):
    step: int
    description: str
    time: int

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
    type: str
    ingredients: List[Ingredient]

parser = PydanticOutputParser(pydantic_object=Recipe)

def _extract_json_snippet(text: str) -> str:
  cleaned = text.strip()
  cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
  cleaned = re.sub(r"\s*```$", "", cleaned)

  m = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", cleaned)
  if not m:
    raise ValueError("No JSON object/array found in model output.")
  return m.group(1)

def _extract_json_array(text: str) -> str:
  cleaned = text.strip()
  cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
  cleaned = re.sub(r"\s*```$", "", cleaned)
  m = re.search(r"\[[\s\S]*\]", cleaned)
  if not m:
    raise ValueError("No JSON array found in model output.")
  return m.group(0)

def generate_recipe(data: dict):
  try:
    prompt = ChatPromptTemplate.from_template('''
        You are a cooking assistant. Given the following transcript and caption,
        generate a structured recipe object in strict JSON format matching this schema:
        {format_instructions}
                                                    
        Fill out the ingredients in the JSON solely based on the caption. Make sure the quantity and unit fields match what is in the caption, but infer is_allergen attributes.
        If caption is empty and/or doesn't list ingredients, infer ingredient list based on context of the transcript.
        Ingredient quantities MUST be strictly numerical, so if quantity is not explicity stated in the caption, infer the quantity and respective unit.
        "For the time in the instruction step, if it is needed include the time in minutes but only if it is specified in the instruction step." \
        "if no time is specified in the instruction, please do not assume how long it takes, just leave it as 0"
        The type attribute is limited to one of these 6 -> Desserts, Drinks, Entrees, Sides, Soups, and Salads.
        The dietary_tags attribute should *only* include tags that mention possible allergens.
          

        Transcript:
        {transcript}

        Caption:
        {caption}

        Include reasonable prep_time and cook_time estimates and steps.
    ''')

    llm = ChatGoogleGenerativeAI(
      model="gemini-2.5-flash",
      temperature=0.2,
      google_api_key=GEMINI_API_KEY
    )

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
  
def generate_ai_instructions(instructions: dict) -> dict:
  try:
    steps = instructions.get("steps", [])
    if not isinstance(steps, list):
        raise ValueError("instructions['steps'] must be a list")

    formatted_steps = "\n".join(
        [f"Step {s['step']}: {s['description']}" for s in steps]
    )

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.6,
        google_api_key=GEMINI_API_KEY,
    )
    prompt_json_schema = """{{
      "ai_steps": [
        {{
          "step": 1,
          "description": "..."
        }}
      ]
    }}"""

    system_msg = SystemMessage(
      content=(
        "You are a friendly AI sous-chef that rewrites structured recipe steps "
        "into short, conversational spoken instructions suitable for a voice assistant. "
        "Keep each ai_description clear, friendly, and concise (one or two sentences)."
      )
    )

    human_msg = HumanMessage(
      content=(
        f"Here are the structured cooking steps:\n\n{formatted_steps}\n\n"
        "Rewrite each step as a human-friendly, conversational instruction. "
        "For the time in the instruction step, if it is needed include the time in minutes but only if it is specified in the instruction step." \
        "if no time is specified in the instruction, please do not assume how long it takes, just leave it as 0"
        "Return ONLY valid JSON, with double-quoted keys and string values, "
        "matching this exact schema (no extra text, no markdown):\n\n"
        f"{prompt_json_schema}\n\n"
        "Make sure the 'step' numbers match the original steps."
      )
    )

    response = llm.invoke([system_msg, human_msg])
    ai_text = response.content.strip()

    try:
      json_snippet = _extract_json_snippet(ai_text)
    except Exception as e:
      print("DEBUG: Failed to extract JSON snippet. Raw model output:\n", ai_text)
      raise

    ai_instructions = json.loads(json_snippet)

    if "ai_steps" not in ai_instructions or not isinstance(ai_instructions["ai_steps"], list):
      raise ValueError("Parsed JSON missing 'ai_steps' list")

    for item in ai_instructions["ai_steps"]:
      if "step" not in item or "description" not in item:
        raise ValueError("Each ai_steps item must include 'step' and 'description'")

    return ai_instructions

  except json.JSONDecodeError as e:
    print("Error: JSON decoding failed:", e)
    return None
  except Exception as e:
    print("Error generating AI instructions:", e)
    return None
  
def categorize_protein_types(ingredients):
  if not ingredients:
      return None
  
  ingredients_list = (
      [i["name"] for i in ingredients] 
      if isinstance(ingredients[0], dict) and "name" in ingredients[0]
      else ingredients
  )

  ingredients_text = ", ".join(ingredients_list)

  llm = ChatGoogleGenerativeAI(
      model="gemini-2.5-flash",
      temperature=0.3,
      google_api_key=GEMINI_API_KEY,
  )

  prompt = ChatPromptTemplate.from_template("""
  You are a food classification assistant.
  Given a list of recipe ingredients, classify which protein categories 
  the recipe includes. Choose only from these exact categories:
  ["chicken", "beef", "pork", "seafood", "vegan", "vegetarian"].

  Rules:
  - Return ONLY a valid JSON array (e.g. ["chicken", "seafood"]).
  - If the recipe is fully plant-based, return ["vegan"] or ["vegetarian"].
  - Use double quotes for JSON strings.
  - No text before or after the JSON array.

  Ingredients: {ingredients}
  """)

  chain = prompt | llm

  try:
      response = chain.invoke({"ingredients": ingredients_text})
      raw_output = response.content.strip()

      json_text = _extract_json_array(raw_output)
      categories = json.loads(json_text)
      if not isinstance(categories, list):
          raise ValueError("Parsed result is not a list")
      print(categories)
      return categories

  except json.JSONDecodeError as e:
      print("Error decoding JSON from Gemini output:", e)
      print("Raw output:", raw_output)
      return None
  except Exception as e:
      print("Error parsing protein categories:", e)
      return None
  
def generate_blog_transcript_and_caption(title: str, text: str) -> dict:
  try:
    llm = ChatGoogleGenerativeAI(
        model='gemini-2.5-flash',
        temperature=0.7,
        google_api_key=GEMINI_API_KEY
    )

    system_msg = SystemMessage(
        content=(
            'You are a helpful recipe assistant that summarizes blog posts. '
            'Given a long blog post about a recipe, generate:\n'
            '1. A pseudo transcript: a step-by-step narrative as if spoken aloud.\n'
            '2. A caption: a short, catchy one-liner summarizing the recipe.\n'
            'Output only valid JSON with double quotes.'
        )
    )

    human_msg = HumanMessage(
        content=(
            f"Blog Title: {title}\n\n"
            f"Full Text:\n{text[:8000]}\n\n"
            "Return JSON in this format:\n"
            "{\n"
            '  "transcript": "A detailed but natural-sounding summary...",\n'
            '  "caption": "A short catchy line about the recipe."\n'
            "}"
        )
    )

    response = llm.invoke([system_msg, human_msg])
    ai_output = response.content.strip()

    if ai_output.startswith("```"):
      ai_output = ai_output.split("```")[1]
      ai_output = ai_output.replace("json", "").strip()

    return json.loads(ai_output)

  except Exception as e:
      print(f'Error generating blog transcript: {e}')
      return None
  


def upload_image():
    if 'thumbnail' not in request.files:
        return jsonify({"error": "no thumbnail"}), 400

    thumbnail = request.files['thumbnail']


    if thumbnail.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if thumbnail:
      thumbnail_name= secure_filename(thumbnail.filename)
      thumbnail_name=f"{uuid.uuid4()}-{thumbnail_name}"
      thumbnail_bytes = thumbnail.read()

      bucket_name = "recipe_images"
      thumbnail_path = f"/{thumbnail_name}"

    try:
      supabase.storage.from_(bucket_name).upload(
          file=thumbnail_bytes,
          path=thumbnail_path,
          file_options={"content-type": 'image/png'} 
      )
      public_url = supabase.storage.from_(bucket_name).get_public_url(thumbnail_path)

      return public_url
    except AuthApiError as e:
            return jsonify({"error":  f"auth error:{e.message}"}), 500
    except Exception as e:
        return jsonify({"error": f"other error:{e.message}"}), 500
import getpass
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.chat_models import init_chat_model
import json
load_dotenv()
##############################################
if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")
model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
  
def createRecipe(content):
  prompt = f"""
  You are a cooking assistant. Analyze the following content I am about to send and turn it into a structure recipe JSON ONLY.
  the content could range from a webscrapted content from a blog and a video transcript
  Make reasonable assumptions about prep and cook time if not stated.
  Infer the ingredients list based on the context and instructions provided in the transcript.
  for the ai_instructios, please humanize them were the sound conversational but leave instructions verbatim.

  Transcript:

  Strictly output *only* the recipe JSON is this format (no markdown, no extra text) so i can json.loads your output in python:

  {{
    "title": "",
    "description": "",
    "instructions": {{
      "steps": [
        {{"step": 1, "description": ""}}
      ]
    }},
    "ai_instructions": {{
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
  initial_messages = [
      SystemMessage(content=prompt),
      HumanMessage(content=content)
  ]
  response=model.invoke(initial_messages)
  
  return response.content
  
import getpass
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.chat_models import init_chat_model
import json
load_dotenv()
##############################################
if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")
model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
  
def createRecipe(content):
  prompt = f"""
  You are a cooking assistant. Analyze the following content I am about to send and turn it into a structure recipe JSON ONLY.
  the content could range from a webscrapted content from a blog and a video transcript
  Make reasonable assumptions about prep and cook time if not stated.
  Infer the ingredients list based on the context and instructions provided in the transcript.
  for the ai_instructios, please humanize them were the sound conversational but leave instructions verbatim.

  Transcript:

  Strictly output *only* the recipe JSON is this format (no markdown, no extra text) so i can json.loads your output in python:

  {{
    "title": "",
    "description": "",
    "instructions": {{
      "steps": [
        {{"step": 1, "description": ""}}
      ]
    }},
    "ai_instructions": {{
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
  initial_messages = [
      SystemMessage(content=prompt),
      HumanMessage(content=content)
  ]
  response=model.invoke(initial_messages)
  
  return response.content
  
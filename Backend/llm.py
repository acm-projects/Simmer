import getpass
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain.chat_models import init_chat_model
load_dotenv()
##############################################
if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")
##############################################

##############################################
workflow = StateGraph(state_schema=MessagesState)

def call_model(state: MessagesState):
  response = model.invoke(state["messages"])
  return {"messages": response}
workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

config = {"configurable": {"thread_id": "abc123"}}
##############################################
recipe_file_path = 'recipe.txt'
try:
    with open(recipe_file_path, 'r') as file:
        recipe_content = file.read()
    print(f"Successfully loaded content from {recipe_file_path}")
except FileNotFoundError:
    print(f"Error: The file '{recipe_file_path}' was not found. Please create it in the same directory.")
    # Exit the script gracefully if the file doesn't exist
    exit()
  
##############################################
instructions='For the following recipe. you are gonna have an ingredient schema where you have ingredient:{ingredientName:string, quantity:float, unit:string} and then you are gonna have a recipes schema where recipes:{recipeName:string, ingredients:[ingredient], instructions:[string]}. I want you to format the recipe into that recipe json format'
model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
# messages = [
#     SystemMessage(content=instructions),
#     HumanMessage(content=recipe_content),
# ]

# response = model.invoke(messages)
# print(response.content)

query = "Hi! I'm Bob."

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()

query = "what is my name again."

input_messages = [HumanMessage(query)]
output = app.invoke({"messages": input_messages}, config)
output["messages"][-1].pretty_print()


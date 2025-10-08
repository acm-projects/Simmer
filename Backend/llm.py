import getpass
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain.chat_models import init_chat_model
import json
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
recipe_file_path = 'recipe.json'
try:
    with open(recipe_file_path, 'r') as file:
        recipe_data = json.load(file)
    print("Successfully loaded recipe JSON object.")
except FileNotFoundError:
    print(f"Json could not be found")
    exit()
except json.JSONDecodeError:
    print(f"File is not a valid json file")
    exit()
##############################################
instructions=(
  f"For the following recipe in json... {recipe_data}, analyze it"
  "Try to teach the recipe to the user step by step in a conversational style"
  "So do not try to teach all in one go"
  "youll will first introduce yourself, describe the recipe"
  "then the user will say next step"
  "you will converse the first step in the instruction"
  "then the user will say next step"
  "you will converse the next step"
  "you will rinse and repeat this until the user has finished the recipe"
  "if the user wants to go back to the recipe, they will say to go back to a instructio number or describe the instruction"
  "then, you will find the step and reexplain the step in a conversational style"
  "after that, you will ask the user if you want to go back to the current step")
model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
# messages = [
#     SystemMessage(content=instructions),
#     HumanMessage(content=recipe_content),
# ]

# response = model.invoke(messages)
# print(response.content)

# query = "Hi! I'm Bob."

# input_messages = [HumanMessage(query)]
# output = app.invoke({"messages": input_messages}, config)
# output["messages"][-1].pretty_print()

# query = "what is my name again."

# input_messages = [HumanMessage(query)]
# output = app.invoke({"messages": input_messages}, config)
# output["messages"][-1].pretty_print()

initial_messages = [
    SystemMessage(content=instructions),
    HumanMessage(content="Hi! Please start teaching me the recipe.")
]
first_response = app.invoke({"messages": initial_messages}, config)
first_response["messages"][-1].pretty_print()

while True:
    try:
        user_input = input("\nYour turn (type 'exit' if your done)")
        if user_input.lower() == 'exit':
            print("\nHappy cooking! Goodbye.")
            break
        response = app.invoke({"messages": [HumanMessage(content=user_input)]}, config)
        response["messages"][-1].pretty_print()

    except KeyboardInterrupt:
        print("\n\nCooking session is over.")
        break
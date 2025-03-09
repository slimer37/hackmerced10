# === Function to Generate Medical Responses ===
from google import genai
from datetime import datetime
import os

import traceback

from mongodb import get_database

db_name = "medical_chatbot_db"
prompt_filename = "script.md"
prompt_file_location = os.path.join(os.path.dirname(__file__), prompt_filename)

prompt_format = ""

if not os.path.exists(prompt_file_location):
    raise Exception(f"Couldn't find {prompt_file_location}")

with open(prompt_file_location) as f:
    prompt_format = f.read()

chat_collection = get_database(db_name)["chats"]

def get_history(user_id) -> tuple[list[str], list[str]]:
    user_data = chat_collection.find_one({"userId": user_id})

    if not user_data: return ([], [])

    return (user_data["prompts"], user_data["responses"])

# ===Check & Update Chat Function ===
def check_and_update(user_id, user_message, bot_response):
    if is_first_message(user_id):
        print("Chat updated successfully!")
        chat_collection.insert_one({
            "userId": user_id,
            "prompts": [{"text": user_message, "timestamp": datetime.utcnow()}],
            "responses": [{"text": bot_response, "timestamp": datetime.utcnow()}]
        })
        print("New chat document created!")
    else:
        # Update the existing document
        chat_collection.update_one(
            {"userId": user_id},
            {
                "$push": {
                    "prompts": {"text": user_message, "timestamp": datetime.utcnow()},
                    "responses": {"text": bot_response, "timestamp": datetime.utcnow()}
                }
            }
        )
        print("Updated existing")

def is_first_message(user_id):
    return not chat_collection.find_one({"userId": user_id})

# === Gemini AI Client ===
genai_client = genai.Client(api_key="AIzaSyCwQ4LPM4J3Skd21Uc7TwWx-msZdGkXIc0")

# Create a chat session to retain conversation history
chat_session = genai_client.chats.create(model="gemini-2.0-flash")
first_message_of_session = True

print("Connected to Gemini session.")

# === Medical Response Function ===
def get_ai_response(user_id, user_message):
    try:
        # Send user message to Gemini AI with script
        global first_message_of_session
        if first_message_of_session:
            history = str(get_history(user_id))
            user_message = prompt_format.format(user_message=user_message, history=history)
            first_message_of_session = False

        # Assuming you have a chat session object that interacts with the Gemini AI
        response = chat_session.send_message_stream("Next user message: " + user_message)

        # Collect response from streamed output
        bot_response = "".join(chunk.text for chunk in response).strip()

        # Store chat history in MongoDB
        check_and_update(user_id, user_message, bot_response)

        return bot_response
    except Exception as e:
        traceback.print_exc()
        return "I am unable to process your request at the moment."

# === Command-line Chatbot Interaction ===
def chat():
    print("\n🤖 Medical Chatbot (Type 'exit' to quit)\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("👋 Goodbye!")
            break
        response = get_ai_response(user_input)
        print(f"Gemini: {response}\n")

# Run chatbot
if __name__ == "__main__":
    chat()
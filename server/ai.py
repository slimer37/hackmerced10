# === Function to Generate Medical Responses ===
from google import genai
from datetime import datetime
import os

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

# === Store Chat Function ===
def store_chat(user_message, bot_response):
    chat_data = {
        "user": user_message,
        "gemini": bot_response,
        "timestamp": datetime.utcnow()
    }
    chat_collection.insert_one(chat_data)
    print("💾 Chat stored successfully!")

# === Gemini AI Client ===
genai_client = genai.Client(api_key="AIzaSyCwQ4LPM4J3Skd21Uc7TwWx-msZdGkXIc0")

# Create a chat session to retain conversation history
chat_session = genai_client.chats.create(model="gemini-2.0-flash")

# === Medical Response Function ===
def get_medical_response(user_message):
    try:
        # Send user message to Gemini AI with script
        response = chat_session.send_message_stream(prompt_format.format(user_message=user_message))

        # Collect response from streamed output
        bot_response = "".join(chunk.text for chunk in response).strip()

        # Store chat history in MongoDB
        store_chat(user_message, bot_response)

        return bot_response
    except Exception as e:
        print(f"❌ Error generating response: {e}")
        return "I am unable to process your request at the moment."

# === Command-line Chatbot Interaction ===
def chat():
    print("\n🤖 Medical Chatbot (Type 'exit' to quit)\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("👋 Goodbye!")
            break
        response = get_medical_response(user_input)
        print(f"Gemini: {response}\n")

# Run chatbot
if __name__ == "__main__":
    chat()
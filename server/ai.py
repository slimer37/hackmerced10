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

# ===Check & Update Chat Function ===
def check_and_update(user_id, user_message, bot_response):
    # Check if the document exists
    existing_entry = chat_collection.find_one({"userId": user_id})
    
    if existing_entry:
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
        print("Chat updated successfully!")
    else:
        chat_collection.insert_one({
            "userId": user_id,
            "prompts": [{"text": user_message, "timestamp": datetime.utcnow()}],
            "responses": [{"text": bot_response, "timestamp": datetime.utcnow()}]
        })
        print("New chat document created!")

# === Gemini AI Client ===
genai_client = genai.Client(api_key="AIzaSyCwQ4LPM4J3Skd21Uc7TwWx-msZdGkXIc0")

print("Connected to Gemini session.")

# Create a chat session to retain conversation history
chat_session = genai_client.chats.create(model="gemini-2.0-flash")
first_message = True

# === Medical Response Function ===
def get_ai_response(user_id, user_message):
    try:
        # Send user message to Gemini AI with script
        if first_message:
            user_message = prompt_format.format(user_message=user_message)

        # Assuming you have a chat session object that interacts with the Gemini AI
        response = chat_session.send_message_stream("Next user message: " + user_message)

        # Collect response from streamed output
        bot_response = "".join(chunk.text for chunk in response).strip()

        # Store chat history in MongoDB
        check_and_update(user_id, user_message, bot_response)

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
        response = get_ai_response(user_input)
        print(f"Gemini: {response}\n")

# Run chatbot
if __name__ == "__main__":
    chat()
# === Function to Generate Medical Responses ===
from google import genai
from datetime import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# === MongoDB Connection ===
uri = "mongodb+srv://mramirez282:hackmerced10@hackmerced10.xqw2k.mongodb.net/?retryWrites=true&w=majority&appName=hackmerced10"
mongo_client = MongoClient(uri, server_api=ServerApi('1'))

# Connect to database and collection
db = mongo_client["medical_chatbot_db"]
chat_collection = db["chats"]

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
        # Send user message to Gemini AI with memory retention
        response = chat_session.send_message_stream(f"""
            You are a **medical chatbot** designed to provide **health-related guidance** ONLY.
            
            - **Retain and recall previous conversations** to provide context-aware responses.
            - If a user mentions **allergies, medications, or conditions**, remember them for future interactions.
            - **Offer over-the-counter medication recommendations** based on symptoms.
            - **Ask follow-up questions** for clarity, such as:
              - 'Do you have any known allergies to medications?'
              - 'Are you currently taking any medications?'
              - 'How long have you had these symptoms?'
            - **Warn users** if symptoms suggest an emergency and advise seeking medical attention.
            - If the input is NOT medical-related, respond with: 'I am a medical chatbot and can only discuss health-related topics.'

            User input: {user_message}
        """)

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

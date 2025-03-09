import { fetch } from 'expo/fetch';

// Define the URL of your backend API
const url = "http://10.35.17.98:3000";

export async function GetUserId(accessToken: string | undefined): Promise<string | null> {
  try {
    const apiResponse = await fetch(url + '/api/myid', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      return "Failed to fetch.";
    } else {
      return (await apiResponse.json())["user_id"];
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    return null;
  }
}

export async function GetAIResponse(
  accessToken: string | undefined,
  userMessage: string
): Promise<string | null> {
  console.log("asking " + userMessage + " at " + url + '/api/ai-msg');

  try {
    // Fetch the AI response
    const apiResponse = await fetch(url + '/api/ai-msg', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage
      })
    });

    const aiResponse = (await apiResponse.json())["response"];

    // Get user ID
    const userId = await GetUserId(accessToken);
    const timestamp = new Date().toISOString();  // Get current timestamp

    // Send the conversation data to the backend (MongoDB)
    await saveConversation(userId, userMessage, aiResponse, timestamp);

    return aiResponse;
  } catch (error) {
    console.error("Error during fetch:", error);
    return null;
  }
}

// Function to save conversation data to the backend (MongoDB)
export async function saveConversation(
  userId: string | null,
  userMessage: string,
  aiResponse: string,
  timestamp: string
) {
  if (!userId) {
    console.error("User ID is null, cannot save conversation.");
    return;
  }

  try {
    const response = await fetch(url + '/save_conversation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        user_message: userMessage,
        ai_response: aiResponse,
        timestamp: timestamp
      }),
    });

    if (response.ok) {
      console.log("Conversation saved successfully.");
    } else {
      console.error("Failed to save conversation.");
    }
  } catch (error) {
    console.error("Error saving conversation:", error);
  }
}

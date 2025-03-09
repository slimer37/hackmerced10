import { fetch } from 'expo/fetch';

// Define the URL of your backend API
const url = "http://10.35.17.98:3000";

export async function ClearData(accessToken: string | undefined): Promise<void> {
  try {
    const apiResponse = await fetch(url + '/api/clear', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      method: 'POST'
    });

    if (!apiResponse.ok) {
      console.error('Response failure: ' + apiResponse.status);
    } else {
      apiResponse.json().then(j => console.log(j));
      alert('Success');
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
}

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

export async function GetChatHistory(accessToken: string | undefined) : Promise<string[]> {
  console.log("attempting to get chat history");
  try {
    const apiResponse = await fetch(url + '/api/ai-msg', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      method: 'GET'
    });

    if (!apiResponse.ok) {
      console.error('Response failure: ' + apiResponse.status);
      return [];
    } else {
      let json = await apiResponse.json();
      console.log(json["messages"]);
      return json["messages"];
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    return [];
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

    return aiResponse;
  } catch (error) {
    console.error("Error during fetch:", error);
    return null;
  }
}

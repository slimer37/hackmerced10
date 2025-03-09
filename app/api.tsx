import { fetch } from 'expo/fetch';

const url = "http://10.35.17.98:3000"

export async function GetUserId(accessToken: string | undefined) {
  try {
    const apiResponse = await fetch(url + '/api/myid', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
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

export async function GetAIResponse(accessToken: string | undefined, userMessage: string) {
  console.log("asking " + userMessage + url + '/api/ai-msg');

  try {
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
  
    if (!apiResponse.ok) {
      return `Failed to fetch: ${apiResponse.status}`;
    } else {
      return (await apiResponse.json())["response"];
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    return null;
  }
}
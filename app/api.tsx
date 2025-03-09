export async function GetUserId(accessToken: string | undefined) {
  const apiResponse = await fetch('http://172.20.10.6:3000/api/myid', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
  });

  if (!apiResponse.ok) {
    return "Failed to fetch.";
  } else {
    return (await apiResponse.json())["user_id"];
  }
}
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { useAuth0 } from "react-native-auth0";

function LogOutButton() {
  const {clearSession} = useAuth0();

  const onLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  return (
    <Button onPress={onLogout} title="Log Out"/>
  );
}

export default function Profile() {
  const {user, getCredentials} = useAuth0();

  const [id, setId] = useState('fetching...');

  useEffect(() => {
    const getId = async() => {
      const accessToken = (await getCredentials())?.accessToken;
      const apiResponse = await fetch('http://172.20.10.6:3000/api/myid', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!apiResponse.ok) {
        setId("Failed to fetch.");
      } else {
        setId((await apiResponse.json())["user_id"]);
      }
    }

    getId();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: 40
      }}
    >
      <Text>You are logged in as <Text style={{fontWeight: 'bold'}}>{user?.name}</Text></Text>
      <Text style={{color: '#999', fontSize: 8}}>ID: {id}</Text>
      <LogOutButton />
    </View>
  );
}

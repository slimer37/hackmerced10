import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { GetUserId, ClearData } from "./api";

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
      setId(await GetUserId(accessToken) ?? 'null')
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
      <Text style={{color: '#999', fontSize: 8}}>Email: {user?.email}</Text>

      <Text style={{color: '#999', fontSize: 8, marginTop: 20}}>This application build was developed by Alfred & Marcelo for HackMerced X!</Text>
      <Text style={{color: '#999', fontSize: 8}}>v1.0</Text>
      <LogOutButton />
      <Button
        onPress={async () => {
          const accessToken = (await getCredentials())?.accessToken;
          await ClearData(accessToken);
        }}
        title="Clear My Data" />
    </View>
  );
}

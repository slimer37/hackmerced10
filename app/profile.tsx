import { Alert, Button, Text, View } from "react-native";
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

  async function onCallAPI() {
    const accessToken = (await getCredentials())?.accessToken;
    const apiResponse = await fetch('http://172.20.10.6:3000/api/private', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
    Alert.alert(await apiResponse.text());
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>You are logged in as {user?.name}</Text>
      <Button title="Test Private API Auth" onPress={onCallAPI}/>
      <LogOutButton />
    </View>
  );
}

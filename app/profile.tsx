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
  const {user} = useAuth0();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>You are logged in as {user?.name}</Text>
      <LogOutButton />
    </View>
  );
}

import { useAuth0 } from 'react-native-auth0';
import { Button, Text, View } from "react-native";

export default function LoginPage() {
  const {authorize, clearSession, user, error, isLoading} = useAuth0();

  const onLogin = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <View style={
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      }
    }>
      <Text>You are not logged in.</Text>
      {error && <Text>{error.message}</Text>}

      <Button
        onPress={onLogin}
        title='Log In'
      />
    </View>
  );
}

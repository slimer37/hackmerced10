import { Button, Text, View } from "react-native";

interface LoginProps {
  onLogin: () => Promise<void>,
  error: Error
}

export default function LoginPage(props: LoginProps) {
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
      {props.error && <Text>{props.error.message}</Text>}

      <Button
        onPress={props.onLogin}
        title='Log In'
      />
    </View>
  );
}

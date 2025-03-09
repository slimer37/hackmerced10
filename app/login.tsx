import { useAuth0 } from 'react-native-auth0';
import { Button, Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function LoginPage() {
  const {authorize, error} = useAuth0();

  const onLogin = async () => {
    try {
      await authorize({ audience: "https://dev.slimer37.me" });
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to</Text>
        <Text style={styles.headerText}>MedicineTracker</Text>
      </View>

      {error && <Text style={styles.errorMessage}>Error: {error.message}</Text>}

      <Button
        onPress={onLogin}
        title='Log In'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 50
  },
  headerText: {
    fontSize: 25
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold'
  },
})

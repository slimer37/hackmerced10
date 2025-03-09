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
        <Text style={styles.headerText}>Welcome to Medly!</Text>
        <Text style={styles.subHeaderText}>by Alfred & Marcelo</Text>
      </View>

      {error && <Text style={styles.errorMessage}>Error: {error.message}</Text>}

      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#888', // Light grey for the subheader
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#4CAF50', // Medly's green
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

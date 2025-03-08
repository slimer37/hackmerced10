import { Stack } from 'expo-router/stack';
import { useAuth0, Auth0Provider } from 'react-native-auth0';
import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import LoginPage from './login';

function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: true }} />
    </Stack>
  );
}

function App() {
  const {user, isLoading} = useAuth0();

  if (isLoading) {
    return <View style={styles.container}><Text>Loading</Text></View>;
  }

  const loggedIn = user !== undefined && user !== null;

  return (
    <>
      {loggedIn && <MainLayout />}
      {!loggedIn && <LoginPage />}
    </>
  )
}

export default function Layout() {
  return (
    <Auth0Provider domain={"dev-g764byi3mgr8fsp2.us.auth0.com"} clientId={"rPPrr9pgCWMg91o2JykRJkPHpcje15RU"}>
      <App/>
    </Auth0Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

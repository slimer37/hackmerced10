import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';

function ProfileButton() {
  const navigation = useNavigation();

  const goToProfile = () => {
    navigation.navigate('profile' as never);
  }
  
  return (
    <TouchableOpacity onPress={goToProfile} style={{ width: 50 }}>
      <FontAwesome size={28} name="user" color="black" style={{margin:'auto'}}/>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue',
        headerLeft: ProfileButton
     }}>
      <Tabs.Screen
        name="index"
        options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
            title: 'Ask AI',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="comment" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mymedicine"
        options={{
          title: 'My Medicine',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="circle-o" color={color} />,
        }}
      />
    </Tabs>
  );
}

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useNavigation } from 'expo-router';

function ProfileButton() {
  const navigation = useNavigation();

  const goToProfile = () => {
    navigation.navigate('profile' as never);
  }
  
  return (
    <FontAwesome size={28} name="user" color="black" style={{ marginLeft: 15 }} onPress={goToProfile}/>
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
        name="medicinesearch"
        options={{
          title: 'Find & Restock',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
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

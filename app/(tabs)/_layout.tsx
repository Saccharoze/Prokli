import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// The four tabs: route file, label, icon.
const TABS: [string, string, IconName][] = [
  ['home', 'Accueil', 'home'],
  ['classement', 'Classement', 'podium'],
  ['defi', 'Défis', 'add-circle'],
  ['profile', 'Profil', 'person'],
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D49FFA',
        tabBarInactiveTintColor: '#909090',
        tabBarLabelStyle: { fontFamily: 'Poppins-Medium', fontSize: 12, marginBottom: 8 },
        tabBarStyle: { height: 84, paddingTop: 8, borderTopColor: '#ffffff' },
      }}
    >
      {TABS.map(([name, label, icon]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ title: label, tabBarIcon: ({ color }) => <Ionicons name={icon} size={24} color={color} /> }}
        />
      ))}
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C94060',
        tabBarInactiveTintColor: '#b0b8c1',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: 'rgba(201, 64, 96, 0.12)',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <SymbolView name="house.fill" style={{ width: 24, height: 24 }} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Patient Profile',
          tabBarIcon: ({ color }) => (
            <SymbolView name="person.crop.circle.fill" style={{ width: 24, height: 24 }} tintColor={color} />
          ),
        }}
      />
    </Tabs>
  );
}

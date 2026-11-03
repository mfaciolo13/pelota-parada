import { Tabs } from 'expo-router';

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
    </Tabs>
  );
};

export default TabLayout;

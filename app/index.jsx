import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper'; // Assuming it's in the 'components' folder relative to the current file


const Index = () => {
  const router = useRouter();
  
  return (
    <ScreenWrapper>
      <Text>Index</Text>
      {/* Correct Button Implementation */}
      <Button title="welcome😉" onPress={() => router.push('welcome')} />
    </ScreenWrapper>
  );
};

export default Index;

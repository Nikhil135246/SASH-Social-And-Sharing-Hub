import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper'; // Assuming it's in the 'components' folder relative to the current file
import Loading from '../components/Loading';


const Index = () => {
  const router = useRouter();
  
  return (
    // no need , cause now we gonna check ki user ka session key active h y ni us hisab se usko home ya login page me rakhenge ge 
    // belwo comment code is veryfirst page off aap(index and , wellcome button wala)
    // <ScreenWrapper>
    //   <Text>Index</Text>
    //   {/* Correct Button Implementation */}
    //   <Button title="welcome😉" onPress={() => router.push('welcome')} />
    // </ScreenWrapper>

    //! checking for sesssion from supabase, do loading state after fetching , redirect to home
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  {/* Display a loading message while the component is loading */}
    <Loading/>
    </View>
  );
};

export default Index;

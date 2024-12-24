import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from 'react-native';

const Home = () => {
  // Import the useAuth hook (assuming it's defined elsewhere)
const { setAuth } = useAuth();


// Define an asynchronous function for handling logout
const onLogout = async () => {
  // Clear the local authentication state
  // setAuth(null); no need to setauth null cuase it been already null from that layoutpage 
  setAuth(null);
  // Attempt to sign out from Supabase
  const { error } = await supabase.auth.signOut();

  // Check if there was an error during sign out
  if (error) {
    // Display an error alert to the user
    Alert.alert('Sign out', "Error signing out!");
  }
};
  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button title = "logout" onPress={onLogout}/>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})
import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Stack ,useRouter} from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';



const _layout = ()=>
{
  return (
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  )
}
const MainLayout = () => {
  const {setAuth} = useAuth();
  const router = useRouter();

  useEffect(()=>{

// bellow is the auth listern it trigger every time when user login , register,logsout
    supabase.auth.onAuthStateChange((_event, session)=>
    {
      console.log('session user: ',session?.user?.id);
      // uper walle code se id and user ka (?) hata doge to purrra session detial (user meta deta mill jayga    ) 

      // setSession(session);
      if(session)//agar session ture h yani user login h tho home me jane bol sakte ha 
      {
        setAuth(session?.user);
        router.replace('main/home');// we willl replace current route so u user cannot go back to welcome page again 
        //first set auth is user ke liye 
        // move to home screen f
      }
      else{
        setAuth(null);
        router.replace('/welcome');
        //set auth to null 
        // move to welcom screen 

      };
    });
    // return () => unsubscribe(); 
  },[])//need to add this empty array very neccessary , for dependences , warna glitch hoga 
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Set header visibility to false
      }}
    />
  );
};

export default _layout;

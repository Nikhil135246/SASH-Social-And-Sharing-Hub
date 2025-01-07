import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from 'react-native';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar';
// import LottieView from 'lottie-react-native';
import LottieView from 'lottie-react-native';
import { fetchPost } from '../../services/postService';



const Home = () => {
  // router for when people click any icone in ♥ .. it redirect to corresponding pages
  const router = useRouter();

  // Import the useAuth hook (assuming it's defined elsewhere)
  const { user, setAuth } = useAuth()
  //console.log('user: ', user);// we can chaeck in home page its not showing all the (that perticual  user's data) that we have defined in supabase user's table (like name,image ,bio, phone no etc )
  // tho ye karne ke liye we will write a line in _layout.jsx ( updateUserData(session?.user);  )
  // Define an asynchronous function for handling logout

  // const onLogout = async () => {
  //   // Clear the local authentication state
  //   // setAuth(null); no need to setauth null cuase it been already null from that layoutpage 
  //   setAuth(null);
  //   // Attempt to sign out from Supabase
  //   const { error } = await supabase.auth.signOut();

  //   // Check if there was an error during sign out
  //   if (error) {
  //     // Display an error alert to the user
  //     Alert.alert('Sign out', "Error signing out!");
  //   }
  // };

  /* Here, a state variable post is defined using useState. It will store the posts fetched from the database. Initially, it's an empty array because no data has been fetched yet. */
  const [post,setPost] = useState([]);//write now its an empty array it will hlep to fetch the post for home screen form supabase
  
    useEffect(()=>{
      //useEffect: This hook runs after the component renders.
      getPosts();
      
      //Dependency Array []: Since the dependency array is empty, this hook runs only once when the component mounts.
    },[])

  const getPosts= async ()=>
  {
    // call the api here mane supabase walla api .form()  . select wagera wall function nothing rocket science

    let res = await fetchPost();
    console.log('got Post result: ',res);

  }


  return (

    <ScreenWrapper bg={'white'} paddingTop={'10'}>

      {/* above paddding added by sonu , remove it if u want  */}
      <View style={styles.container} >
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>SimpleHub</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push('./notifications')}>
              <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push('./newpost')}>
              <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push('./profile')}>


              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>

        </View>
      </View>
      {/* <Button title="logout" onPress={onLogout} /> */}

      <View style={styles.welcome}>
        {/* <LottieView style={{ flex: 1 }} source={require('../../assets/images/welcome.json')} autoPlay loop /> */}

      </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: wp(4)
  },
  welcome: {
    height: 300,
    aspectRatio: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4)
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18

  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4)
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight
  },
  pillText: {
    color: 'white',
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold
  }
});
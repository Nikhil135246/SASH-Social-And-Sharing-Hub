import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from 'react-native';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';
import { useRouter } from 'expo-router';
import  Avatar  from '../../components/Avatar';

const Home = () => {
  // router for when people click any icone in ♥ .. it redirect to corresponding pages
  const router = useRouter();

  // Import the useAuth hook (assuming it's defined elsewhere)
  const { user, setAuth } = useAuth();
  console.log('user: ', user);// we can chaeck in home page its not showing all the user data that we have defined in supabase user's table (like name,image ,bio, phone no etc )
  // tho ye karne ke liye we will write a line in _layout.jsx ( updateUserData(session?.user);  )
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
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>SimpleHub</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push('notifications')}>
              <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push('newPost')}>
              <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push('profile')}>

              
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
      <Button title="logout" onPress={onLogout} />
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: wp(4)
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
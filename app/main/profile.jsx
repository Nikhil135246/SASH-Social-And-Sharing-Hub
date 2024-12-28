import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import { hp, wp } from '../../helpers/common';
import Icon from '../../assets/icons';
import { theme } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import Avatar from '../../components/Avatar';


const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

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

  const handleLogout = async () => {
    // Show confirm modal
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => console.log("modal cancelled"),
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: () => onLogout(),
        style: "destructive",

      }
    ]);
  };

  return (
    <ScreenWrapper bg="white">
      <UserHeader user={user} router={router} handleLogout={handleLogout} />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, handleLogout }) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
      <View>
        <Header title="Profile" mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name='logout' color={theme.colors.rose} />

        </TouchableOpacity>



      </View>
      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          {/* uper jo gap hota ha vo gap view ke childrends ke bich ki gap hoti ha 
              agar view ke ander 3 text ha 
              hello 
              this 
              is nikhil 
              //!Vtho gap between hello = this = is nikhil wala gap ha not ki uper wale view componet ke bich ki gap
               */}
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.imgae}
              size={hp(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable style={styles.editIcon} onPress={() => router.push('./editProfile')}>
              <Icon name="edit" strokeWidth={2.5} size={20} />
            </Pressable>
            {/* user name  and address part  */}
          </View>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={styles.userName}>{user && user.name || 'guest'}</Text>
            <Text style={styles.infoText}>{user && user.address || 'place'}</Text>
            {/* sonu
              jo extra or ke sath dala gaya condition h vo bs test ke liye hata dena vese bhi its not a good way to add like this 
              matlab dal sakte ho per optimize way mein yani  

              //!! <Text style={styles.userName}>{user?.name || 'guest'}</Text>

              */}

          </View>
          {/* Email,PHone,Bio */}
          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              <Icon name="mail" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{user && user.email}</Text>
            </View>

            {
              user && user.phoneNumber && (
                <View style={styles.info}>
                  <Icon name="call" size={20} color={theme.colors.textLight} />
                  <Text style={styles.infoText}>{user && user.phoneNumber}</Text>
                </View>)
            }
            {
              user && user.bio && (
                <Text style={styles.infoText}>{user.bio || 'User bio'}</Text>
              ) 

            }


          </View>
        </View>

      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },

  headerShape: {
    width: wp(100),
    height: hp(20),
  },

  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },

  userName: {
    fontSize: hp(3),
    fontWeight: '500',
    color: theme.colors.textDark
  },

  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: theme.colors.textLight
  },

  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: '#fee2e2'
  },

  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },

  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text
  }
});
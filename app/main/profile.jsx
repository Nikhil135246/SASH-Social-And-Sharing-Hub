import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import { hp, wp } from '../../helpers/common';
import Icon from '../../assets/icons';
import { theme } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import Avatar from '../../components/Avatar';
import { fetchPosts } from '../../services/postService';
import { FlatList } from 'react-native';
import PostCard from '../../components/PostCard';
import Loading from '../../components/Loading';

var limit = 0;
const Profile = () => {

    const [currentlyPlayingPostId, setCurrentlyPlayingPostId] = useState(null); // State to track currently playing video
      // Handle video play event (to stop other videos)
      const handleVideoPlay = (postId) => {
        // If the video is already playing, stop it
        if (currentlyPlayingPostId === postId) {
          setCurrentlyPlayingPostId(null); // Stop the video
        } else {
          setCurrentlyPlayingPostId(postId); // Play the selected video
        }
      };

  const { user, setAuth } = useAuth();
  const router = useRouter();

    /* Here, a state variable post is defined using useState. It will store the posts fetched from the database. Initially, it's an empty array because no data has been fetched yet. */
    const [posts, setPosts] = useState([]); //write now its an empty array it will hlep to fetch the post for home screen form supabase
    const [hasMore, setHasMore] = useState(true);// this has more is for if we scroll to end then apne ko kaise pata chalega aur post batach ha ki , kyu apna logic abhi tak tho bs fetch karta tha extra post irrespective of ki post aur ha ki ni tho ye fix karna h
  
      const getPosts = async () => {
        // call the api here mane supabase walla api .form()  . select wagera wall function nothing rocket science
    
        if (!hasMore) return null;
        limit = limit + 5; // we will increase limit every time we end to bottom
    
        console.log("fetching post: ", limit);
        let res = await fetchPosts(limit,user.id);
        // console.log('got Post result: ',res);
        if (res.success) {
          if (posts.length == res.data.length) setHasMore(false);
          // uper walla check kar rha ki aur post ha ki ni
          setPosts(res.data);
        }
      };

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
      <FlatList
      ListHeaderComponent={<UserHeader user={user} router={router} handleLogout={handleLogout} />}
      ListHeaderComponentStyle={{marginBottom: 30}}
       initialNumToRender={10}
       data={posts}
       showsVerticalScrollIndicator={false}
       contentContainerStyle={styles.listStyle}
       keyExtractor={(item) => item.id.toString()}
       renderItem={({ item }) => (
         <PostCard item={item} currentUser={user} router={router} currentlyPlayingPostId={currentlyPlayingPostId} onVideoPlay={handleVideoPlay}/>
       )}
       //! creating fucntion that  call get post when we rich end
       onEndReached={() => {
         console.log("got to the end");
         getPosts();
       }}
       onEndReachedThreshold={0}
       // that means jab last ke zero pixel mein pahuncho ge tho onendreached  hoga

       ListFooterComponent={
         hasMore ? (
           <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
             {/* 
            kyu ek jab  initally home page load hoga( ya 0 post hoga ) tho loading screen top mein dekhega ajeeb lagega 
            so we will do jab no post ho  es liye if posts zeor ha tho magin 200 warna 30  
            //! after this part now very imp important part
           now we do enable  realtime changes in supabase ( database > publication > initalaaly zero table seletect for realtime updation , now we select ( notification , post , and comment table to make it realtime))
           also at last i diabled truncating event ( check se uncheckd kiya isko ) kyu ki ye ni chahye kuch delete ni karna h apne ko 
        
            //! now we make channel wichi listen posts in posts table ( doin this code after this getpostos funciton line  )
            */}
             <Loading/>
           </View>
         ) : (
           <View style={{ marginVertical: 30 }}>
             <Text style={styles.noPosts}>No more posts</Text>
           </View>
         )
       }
     />

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
              uri={user?.image}
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
    backgroundColor: '#e1fffc'
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
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "react-native";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
// import LottieView from 'lottie-react-native';
// import LottieView from 'lottie-react-native';
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import LoadingAnimated from "../../components/LoadingAnimated";
import { getUserData } from "../../services/userService";
import { preProcessFile } from "typescript";

var limit = 0;
const Home = () => {
  // router for when people click any icone in ♥ .. it redirect to corresponding pages
  const router = useRouter();

  // Import the useAuth hook (assuming it's defined elsewhere)
  const { user, setAuth } = useAuth();
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
  const [posts, setPosts] = useState([]); //write now its an empty array it will hlep to fetch the post for home screen form supabase

  const [hasMore, setHasMore] = useState(true);
  // this has more is for if we scroll to end then apne ko kaise pata chalega aur post batach ha ki , kyu apna logic abhi tak tho bs fetch karta tha extra post irrespective of ki post aur ha ki ni tho ye fix karna h

  const handlePostEvent = async (payload) => {
    //!payload is the data sent by Supabase when a change (like adding a new post) occurs in the database. It contains the details of that change.
    console.log(
      "payload arre kya action hua kya delete ya insert ya update huaa uska id  : ",
      payload
    ); //all good sab sahi bs ek chiz ni aaraha user object but user id mill aa jara haa tho apan user id se user object nikallenga
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      // This checks if the event type is 'INSERT' (i.e., a new post has been added).
      // It also checks if payload.new.id exists, meaning there is a new post to process.
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userid); //  (newPosts)pataa ni khan apan ek jagah userId ke place mein userid likhe tho har jahag wahi use karna padh raha h
      // res ke ander apna data nekal rahe h (name , profile, wagera) us user ka jisne post kiya h
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      // [newPost, ...prevPosts] This syntax is called array destructuring. It creates a new array by adding newPost at the beginning of the prevPosts array.
    }
    /* 
    
    below wt happning 
    When a post is deleted (payload.eventType == "DELETE"),
    this code filters out the deleted post from the current list
    (prevPosts) using its id (payload.old.id (supabase keep tarack of that old id jiske uper action leya gaya h)), then updates the list to exclude that post. 
    thats why we imidietly see the delete post is gone from (all posts list in home) */
    if (payload.eventType === "DELETE" && payload.old.id) {
      // if event is delete and deleted item has valid id then
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.filter(
          (post) => post.id !== payload.old.id
          // (post) => post.id !== payload.old.id is a call back function (A callback is a function((post)=>....old.id) passed as an argument to another function, to be executed later.)
        );
        return updatedPosts;
      });
    }
  };

  useEffect(() => {
    // let commentChannel=supabase
    // .channel('comments')
    // .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' })
    // .subscribe();

    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      // postgres_changes is a special event in Supabase that listens for changes in a table (like inserts, updates, or deletes).
      // on(ye hone mein , ye call kar do )
      .subscribe();

    //4:24:36 time to know more for video
    //useEffect: This hook runs after the component renders.
    // getPosts();// we are already calling this function in onEndReached line mein so no need to call here c
    return () => {
      supabase.removeChannel(postChannel);
      // supabase.removeChannel(commentChannel);
      // return () => { supabase.removeChannel(postChannel); }: When the component is unmounted (e.g., the user navigates away from this page), this removes the real-time channel to stop listening to changes, preventing unnecessary memory usage or errors.
    };

    //Dependency Array []: Since the dependency array is empty, this hook runs only once when the component mounts.
  }, []);

  const getPosts = async () => {
    // call the api here mane supabase walla api .form()  . select wagera wall function nothing rocket science

    if (!hasMore) return null;
    limit = limit + 5; // we will increase limit every time we end to bottom

    console.log("fetching post: ", limit);
    let res = await fetchPosts(limit);
    // console.log('got Post result: ',res);
    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      // uper walla check kar rha ki aur post ha ki ni
      setPosts(res.data);
    }
  };

  return (
    <ScreenWrapper bg={"white"} paddingTop={"10"}>
      {/* above paddding added by sonu , remove it if u want  */}
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>SimpleHub</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("./notifications")}>
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("./newpost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("./profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>
        {/* posts  */}
        <FlatList
          initialNumToRender={10}
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
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
              <View style={{ marginVertical: posts.length == 0 ? 275 : 30 }}>
                {/* 
               kyu ek jab  initally home page load hoga( ya 0 post hoga ) tho loading screen top mein dekhega ajeeb lagega 
               so we will do jab no post ho  es liye if posts zeor ha tho magin 200 warna 30  
               //! after this part now very imp important part
              now we do enable  realtime changes in supabase ( database > publication > initalaaly zero table seletect for realtime updation , now we select ( notification , post , and comment table to make it realtime))
              also at last i diabled truncating event ( check se uncheckd kiya isko ) kyu ki ye ni chahye kuch delete ni karna h apne ko 
           
               //! now we make channel wichi listen posts in posts table ( doin this code after this getpostos funciton line  )
               */}
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.noPosts}>No more posts</Text>
              </View>
            )
          }
        />
      </View>
      {/* <Button title="logout" onPress={onLogout} /> */}

      {/*  <View style={styles.welcome}>
        { <LottieView style={{ flex: 1 }} source={require('../../assets/images/welcome.json')} autoPlay loop /> }

      </View> */}
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: wp(4)
  },
  welcome: {
    height: 300,
    aspectRatio: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
});

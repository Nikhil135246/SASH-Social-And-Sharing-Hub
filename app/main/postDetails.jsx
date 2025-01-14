import { Alert, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetials, removeComment } from '../../services/postService';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import PostCard from '../../components/PostCard';
import Input from '../../components/Input';
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';
import { supabase } from '../../lib/supabase';
import { getUserData } from '../../services/userService';

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);//initally its ture we make it faluse when we have successfully fetch the post detials
  const [loading, setLoading] = useState(false);// this loading form comment 
  const inputRef = useRef(null);//for comment
  //reson to use (if we commented the we want to clear input box)


  const commentRef = useRef('');
  // need one more ref TO hold the comment value



  // useLocalsearchParams = hook by expo  
  //  If your route includes query parameters
  //  like ?postId=123, the useLocalSearchParams hook allows you to access those parameters directly in your component.
  const [post, setPost] = useState(null);
// realtime comments add
  const handleNewComment = async (payload)=>{
    console.log("got new comment:", payload.new)
    if(payload.new)
    {
      let newComment={...payload.new};
      let res = await getUserData(newComment.userid);
      newComment.user  = res.success? res.data:{};
      setPost(prevPost=>{
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments]
        }
      })
    }
  }

  useEffect(() => {

    let commentChannel = supabase
      .channel('comments')
      .on('postgres_changes',{ 
         event: 'INSERT',
         schema: 'public',
         table: 'comments',
        filter:`postid=eq.${postId}`},
         handleNewComment)

      // postgres_changes is a special event in Supabase that listens for changes in a table (like inserts, updates, or deletes).
      // on(ye hone mein , ye call kar do )
      .subscribe();
      getPostDetials();
    //5:35:40 time to know more for video   
    return () => {
      supabase.removeChannel(commentChannel);
      // return () => { supabase.removeChannel(postChannel); }: When the component is unmounted (e.g., the user navigates away from this page), this removes the real-time channel to stop listening to changes, preventing unnecessary memory usage or errors.
    }

    //Dependency Array []: Since the dependency array is empty, this hook runs only once when the component mounts.
  }, [])


  console.log('got post Id: ', postId);//just to check ki ?qury se jo postid aaraha tah vo sach mein aa raha ha ki ni 
  const getPostDetials = async () => {
    // fetch post details here 
    // ab api create karo detial fetch karne ke liye (fetchpostdetials in siede postservices.js)
    let res = await fetchPostDetials(postId);
    // console.log('got post Detials: ',res);
    if (res.success) setPost(res.data);

    // fetching done so now 
    setStartLoading(false);


  }

  const onNewComment = async () => {
    Keyboard.dismiss();
    if (!commentRef.current) return null;
    let data = {
      userid: user?.id,
      postid: post?.id,
      text: commentRef.current
    }
    // create comment & comment get created but it wont show realtime update we will do it later ( but for sure )
    setLoading(true);
    let res = await createComment(data);
    setLoading(false);
    if (res.success) {
      // send notification to post for every one do it later
      inputRef?.current?.clear();
      commentRef.current = ""; //here ? ni lagega because we are setting value
    } else {
      Alert.alert("comment", res.msg);
    }

  }
  const onDeleteComment = async (comment) => {
    console.log('deleting comment : ', comment);
    let res = await removeComment(comment?.id);
    if (res.success) {
      setPost(prevPost => {
        //setPost(prevPost => { /* Do something with prevPost */ });
        // this syntax means prevpost hold , current values in post a state variable ([post,setPost]=useState(null);) <--this 

        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(c => c.id != comment.id);
        /* The condition here is: c.id != comment.id, meaning "keep all comments except the one with the same id as the comment being deleted." */
        return updatedPost;
      })
    } else {
      Alert.alert("comment", res.msg);
    }

  }


  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.center, { justifyContent: 'flex-start', marginTop: 100 }]}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: 'black',
          textAlign: 'center',
          lineHeight: 24,
          marginHorizontal: 20,
          textTransform: 'uppercase',
          paddingVertical: 10,
          fontFamily: 'Arial',
        }}>
          Uh-oh, This post had a little breakup💔 with the server!
        </Text>

      </View>
    )
  }
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      >
        <PostCard
          item={{ ...post, comments: [{ count: post?.comments?.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
        />
        {/* create comment input ui */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            placeholder="Type comment..."
            onChangeText={value => commentRef.current = value}
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl, paddingRight: hp(6) }}
          />
          {
            loading ? (
              <View style={styles.loading}>
                <Loading size='small' />
              </View>

            ) : (

              <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name="send" color={theme.colors.primaryDark} />
              </TouchableOpacity>
            )}
        </View>
        {/* comment list */}
        <View style={{ marginVertical: 15, gap: 17 }}>

          {post?.comments?.map(comment => (
            <CommentItem
              key={comment?.id?.toString()}
              item={comment}
              canDelete={user.id == comment.userid || user.id == post.userid}
              onDelete={onDeleteComment}

            />
          )
          )

          }
          {
            post?.comments?.length == 0 && (
              <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
                Be first to commen
              </Text>
            )
          }

        </View>

      </ScrollView >

    </View >
  )
}

export default PostDetails

const styles = StyleSheet.create({
  // Styling for the "container" component
  container: {
    flex: 1, // Flex item takes up available space
    backgroundColor: 'white', // Background color
    paddingVertical: wp(7), // Vertical padding in responsive units
  },

  // Styling for the "inputContainer" component
  inputContainer: {
    flexDirection: 'row', // Arrange child elements in a row
    alignItems: 'center', // Center items vertically
    gap: 10, // Space between child elements

  },

  // Styling for the "list" component
  list: {
    paddingHorizontal: wp(4), // Horizontal padding in responsive units
  },

  // Styling for the "sendIcon" component
  sendIcon: {
    position: 'absolute', // Position the send icon inside the input
    right: hp(1.5), // Add padding to the right
    height: hp(4), // Adjust height of the icon
    width: hp(4), // Adjust width of the icon
    justifyContent: 'center', // Center the icon vertically
    alignItems: 'center', // Center the icon horizontally
  },

  // Styling for the "center" component
  center: {
    flex: 1, // Flex item takes up available space
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
  },

  // Styling for the "notFound" text
  notFound: {
    fontSize: hp(2.5), // Font size in responsive units
    color: theme.colors.text, // Text color
    fontWeight: theme.fonts.medium, // Font weight
  },

  // Styling for the "loading" component
  loading: {
    position: 'absolute',
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(4),
    width: hp(4),
  }
})
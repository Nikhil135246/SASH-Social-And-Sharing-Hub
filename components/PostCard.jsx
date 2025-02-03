import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { hp, stripHtmlTags, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import RenderHTML from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getSupabaseFileUrl } from "../services/imageService";
import { Video } from "expo-av";
import { createPostLike, removePostLike } from "../services/postService";
import Loading from "./Loading";

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
  currentlyPlayingPostId,
  onVideoPlay,
}) => {
  const isPlaying = currentlyPlayingPostId === item.id; // Check if this video is currently playing
  const handleVideoPress = () => {
    console.log("which video clicked: ", item.id, isPlaying);
    onVideoPlay(item.id); // Trigger the video play or stop based on the current state
  };
  

  


  const glowingStyles = {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
    shadowColor: "rgba(0, 255, 255, 0.8)",
  };

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [lastClick, setLastClick] = useState(0); // Track the last click time
  const doubleClickThreshold = 300; // Time threshold for double click (in milliseconds)

  useEffect(() => {
    setLikes(item?.postlike || []); // Set likes (fix for the undefined error)
  }, [item]);

  const handleDoubleClick = () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClick < doubleClickThreshold) {
      // Double click detected
      onLike(); // Toggle the like
    }
    setLastClick(currentTime);
  };


  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    // onVideoPlay(item.id);
    router.push({ pathname: "./postDetails", params: { postId: item?.id } });
  };

  const onLike = async () => {
    if (liked) {
      let updatedLikes = likes.filter((like) => like.userid != currentUser?.id);
      setLikes([...updatedLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      if (!res.success) {
        Alert.alert("Post", "Something went wrong!");
      }
    } else {
      let data = {
        userid: currentUser?.id,
        postid: item?.id,
      };
      setLikes([...likes, data]);
      let res = await createPostLike(data);
      if (!res.success) {
        Alert.alert("Post", "Something went wrong!");
      }
    }
  };

  const onShare = async () => {
    let content = { message: stripHtmlTags(item?.body) };
    if (item?.file) {
      setLoading(true);
      let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
      
      if (!url) {
        setLoading(false);
        Alert.alert("Error", "File download failed.");
        return;
      }
      setLoading(false);
      content.url = url;
    }
    Share.share(content);
  };

  const handlePostDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to do this?", [
      {
        text: "Cancel",
        onPress: () => console.log("modal cancelled"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      },
    ]);
  };

  const createdAt = moment(item?.created_at).format("MMM D");
  const liked = likes && likes.length > 0 ? likes.filter((like) => like.userid == currentUser?.id)[0] : false;

  return (
    <View style={[styles.container, hasShadow && glowingStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar size={hp(4.5)} uri={item?.user?.image} rounded={theme.radius.md} />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="threeDotsHorizontal" size={hp(4)} strokeWidth={4} color={theme.colors.textDark} />
          </TouchableOpacity>
        )}
        {showDelete && currentUser.id === item?.userid && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)}>
              <Icon name="edit" size={hp(2.8)} color={theme.colors.textDark} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDelete}>
              <Icon name="delete" size={hp(2.8)} color={theme.colors.rose} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && <RenderHTML contentWidth={wp(100)} source={{ html: item?.body || " " }} tagsStyles={tagsStyles} />}
        </View>
        {item?.file && item?.file?.includes("postImages") && (
          <TouchableOpacity onPress={handleDoubleClick}> 
          <Image source={getSupabaseFileUrl(item?.file)} transition={100} activeOpacity={0.01} style={styles.postMedia} contentFit="cover" />
        </TouchableOpacity>
        )}
        {item?.file && item?.file?.includes("postVideos") && (
          <TouchableOpacity onPress={handleVideoPress}>

          <Video
            style={[styles.postMedia, { height: hp(45) }]}
            source={getSupabaseFileUrl(item?.file)}
            resizeMode="cover"
            isLooping
            useNativeControls 
            shouldPlay={isPlaying} // Only play the video if it's the currently playing one
            
            />
            
            </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon name="heart" size={24} fill={liked ? theme.colors.rose : "transparent"} color={liked ? theme.colors.rose : theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments[0]?.count}</Text>
        </View>
        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon name="share" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});

export default PostCard;

import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
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

// Static styles for HTML rendering to prevent unnecessary recalculations
const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: { color: theme.colors.dark },
  h4: { color: theme.colors.dark },
};

// Memoized component to prevent unnecessary re-renders
const PostCard = memo(
  ({
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
    // State for managing likes and loading states
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastClick, setLastClick] = useState(0);

    // Derived states
    // video pause
    // const isPlaying = currentlyPlayingPostId === item.id;
    const createdAt = moment(item?.created_at).format("MMM D");
    const liked = useMemo(
      () => likes?.some((like) => like.userid === currentUser?.id),
      [likes, currentUser?.id]
    );

    // Double click detection constants
    const DOUBLE_CLICK_THRESHOLD = 300;

    // Sync likes with item updates
    useEffect(() => {
      setLikes(item?.postlike || []);
    }, [item?.postlike]); // Only update when postlike changes

    // Memoized video press handler
    const handleVideoPress = useCallback(() => {
      const currentTime = Date.now();
      
      // Single tap handling
      if (currentTime - lastClick > DOUBLE_CLICK_THRESHOLD) {
        // Toggle video play/pause
        setCurrentlyPlayingPostId(prev => prev === item.id ? null : item.id);
      }
      
      // Double tap handling
      if (currentTime - lastClick < DOUBLE_CLICK_THRESHOLD) {
        onLike();
      }
      
      setLastClick(currentTime);
    }, [lastClick, onLike, item.id]);
    
    // Optimized double click handler
    const handleDoubleClick = useCallback(() => {
      const currentTime = Date.now();
      if (currentTime - lastClick < DOUBLE_CLICK_THRESHOLD) {
        onLike();
      }
      setLastClick(currentTime);
    }, [lastClick, onLike]);

    // Memoized like handler with state optimization
    const onLike = useCallback(async () => {
      const updateLikes = liked
        ? likes.filter((like) => like.userid !== currentUser?.id)
        : [...likes, { userid: currentUser?.id, postid: item?.id }];

      setLikes(updateLikes);

      const apiCall = liked
        ? removePostLike(item?.id, currentUser?.id)
        : createPostLike({ userid: currentUser?.id, postid: item?.id });

      const res = await apiCall;
      if (!res.success) Alert.alert("Post", "Something went wrong!");
    }, [liked, likes, currentUser?.id, item?.id]);

    // Memoized share handler with file caching
    const onShare = useCallback(async () => {
      const content = { message: stripHtmlTags(item?.body) };

      if (item?.file) {
        setLoading(true);
        try {
          const url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
          content.url = url;
        } catch (error) {
          Alert.alert("Error", "File download failed.");
        }
        setLoading(false);
      }

      Share.share(content);
    }, [item?.body, item?.file]);

    // Memoized delete confirmation dialog
    const handlePostDelete = useCallback(() => {
      Alert.alert("Confirm", "Are you sure you want to delete this post?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => onDelete(item), style: "destructive" },
      ]);
    }, [item, onDelete]);

    // Memoized post details navigation
    const openPostDetails = useCallback(() => {
      if (showMoreIcon) {
        router.push({
          pathname: "./postDetails",
          params: { postId: item?.id },
        });
      }
    }, [showMoreIcon, item?.id, router]);

    // Memoized style calculations
    const containerStyle = useMemo(
      () => [styles.container, hasShadow && styles.glowingShadow],
      [hasShadow]
    );

    // Update the mediaStyle memoization
    const mediaStyle = useMemo(() => {
      const baseStyle = [styles.postMedia];
      if (item?.file?.includes("postVideos")) {
        return [...baseStyle, { height: hp(45) }];
      }
      else if (item?.file?.includes("postImages")) {
      return [...baseStyle, { height: hp(40) }];} // Explicit height for images
    }, [item?.file]);

    return (
      <View style={containerStyle}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => router.push({ pathname: "./profile", params: { userId: item?.user?.id } })}>

            <Avatar
              size={hp(4.5)}
              uri={item?.user?.image}
              rounded={theme.radius.md}
              />
              </TouchableOpacity>
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>{item?.user?.name}</Text>
              <Text style={styles.postTime}>{createdAt}</Text>
            </View>
          </View>

          {showMoreIcon && (
            <TouchableOpacity onPress={openPostDetails}>
              <Icon
                name="threeDotsHorizontal"
                size={hp(4)}
                strokeWidth={4}
                color={theme.colors.textDark}
              />
            </TouchableOpacity>
          )}

          {showDelete && currentUser?.id === item?.userid && (
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Icon
                  name="edit"
                  size={hp(2.8)}
                  color={theme.colors.textDark}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePostDelete}>
                <Icon name="delete" size={hp(2.8)} color={theme.colors.rose} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {item?.body && (
            <View style={styles.postBody}>
              <RenderHTML
                contentWidth={wp(100)}
                source={{ html: item.body }}
                tagsStyles={tagsStyles}
              />
            </View>
          )}

          {item?.file && (
            <TouchableOpacity onPress={handleDoubleClick}
            activeOpacity={0.9}>
              {item.file.includes("postImages") ? (
                <Image
                  source={getSupabaseFileUrl(item.file)}
                  transition={100}
                  style={mediaStyle}
                  contentFit="cover"
                />
              ) : (
                <Video
                  style={mediaStyle}
                  source={getSupabaseFileUrl(item.file)}
                  resizeMode="cover"
                  isLooping
                  useNativeControls
                  shouldPlay={currentlyPlayingPostId === item.id}
                  // Add pause handler for better control
                  onPlaybackStatusUpdate={(status) => {
                    if (
                      !status.isPlaying &&
                      currentlyPlayingPostId === item.id
                    ) {
                      // setCurrentlyPlayingPostId(null);
                    }
                  }}
                />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <TouchableOpacity onPress={onLike}>
              <Icon
                name="heart"
                size={24}
                fill={liked ? theme.colors.rose : "transparent"}
                color={liked ? theme.colors.rose : theme.colors.textLight}
              />
            </TouchableOpacity>
            <Text style={styles.count}>{likes?.length}</Text>
          </View>

          <View style={styles.footerButton}>
            <TouchableOpacity onPress={openPostDetails}>
              <Icon name="comment" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>{item?.comments[0]?.count || 0}</Text>
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
  },
  areEqual
);

// Custom comparison function for memoization
function areEqual(prevProps, nextProps) {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.body === nextProps.item.body &&
    prevProps.item.file === nextProps.item.file &&
    prevProps.item.postLikes?.length === nextProps.item.postLikes?.length &&
    prevProps.item.comments?.count === nextProps.item.comments?.count &&
    prevProps.currentUser?.id === nextProps.currentUser?.id &&
    prevProps.currentlyPlayingPostId === nextProps.currentlyPlayingPostId &&
    prevProps.onVideoPlay === nextProps.onVideoPlay
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
  },
  glowingShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
    shadowColor: "rgba(0, 255, 255, 0.8)",
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

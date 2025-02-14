import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { handleUrlParams } from "expo-router/build/fork/getStateFromPath-forks";
import Avatar from "./Avatar";
import moment from "moment";

const NotificationItem = ({ item, router }) => {
    const [newComment, setNewComment] = useState(true); // Track if the comment is new
  const handleClick = () => {
    let {postId,commentId}=JSON.parse(item?.data);
    router.push({pathname:'./postDetails',params:{postId,commentId}});
    
    // open Post detials
    // red notification in new comment


    const handleClick = () => {
        setNewComment(false);  // Mark as read when clicked
        let { postId, commentId } = JSON.parse(item?.data);
        router.push({ pathname: './postDetails', params: { postId, commentId } });
        markAsRead(item.id); // Call function to update the read status in the parent
      };
  };

  const createdAt=moment(item?.created_at).format('MMM d');

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
    <Avatar uri={item?.sender?.image} size={hp(6)} />
    <View style={styles.nameTitle}>
      <Text style={styles.text}>{item?.sender?.name}</Text>
      <Text style={[styles.text, { color: theme.colors.textDark }]}>{item?.title}</Text>
    </View>
    <Text style={[styles.text, { color: theme.colors.textLight }]}>{createdAt}</Text>
    {newComment && (
      <View style={styles.redPill}></View> // Red pill for new comment
    )}
  </TouchableOpacity>
  );
};

export default NotificationItem;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    // paddingVertikal: 12,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  nameTitle: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
});

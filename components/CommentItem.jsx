import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import moment from "moment";
import Avatar from "./Avatar";
import Icon from "../assets/icons";

const CommentItem = ({
  item,
  canDelete = false,
  onDelete = () => {
    // no such onDelete function is passed from parent then we use this empty onDelete okay
    // just to avoid errors , just to be in safe side
    // because im passing ondelte function from parent
  },
}) => {
  const createdAt = moment(item?.created_at).format("MMM d");
  const handelDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to do this?", [
      console.log("item:", item),
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
  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image} />

      <View style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item?.user?.name}</Text>
            <Text>.</Text>
            <Text style={[styles.text, { color: theme.colors.textLight }]}>
              {createdAt}
            </Text>
          </View>
          {canDelete && (
            <TouchableOpacity onPress={handelDelete}>
              <Icon name="delete" size={20} color={theme.colors.rose} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.text, { fontWeight: "normal" }]}>
          {item?.text}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  // Styling for the "container" component
  container: {
    flex: 1, // Flex item takes up available space
    flexDirection: "row", // Arrange child elements in a row
    gap: 7, // Space between child elements
  },

  // Styling for the "content" component
  content: {
    backgroundColor: "rgba(97, 233, 243, 0.09)", // Semi-transparent background color
    flex: 1, // Flex item takes up available space
    gap: 5, // Space between child elements
    paddingHorizontal: 14, // Horizontal padding
    paddingVertical: 10, // Vertical padding
    borderRadius: theme.radius.md, // Border radius
    borderCurve: "continuous", // Ensures a smooth border curve
  },

  // Styling for the "highlight" component
  highlight: {
    borderWidth: 0.2, // Border width
    backgroundColor: "white", // Background color
    borderColor: theme.colors.dark, // Border color
    shadowColor: theme.colors.dark, // Shadow color
    shadowOffset: { width: 0, height: 0 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 8, // Shadow radius
    elevation: 5, // Elevation for Android
  },

  // Styling for the "nameContainer" component
  nameContainer: {
    flexDirection: "row", // Arrange child elements in a row
    alignItems: "center", // Center items vertically
    gap: 3, // Space between child elements
  },

  // Styling for the "text" component
  text: {
    fontSize: hp(1.6), // Font size in responsive units
    fontWeight: theme.fonts.medium, // Font weight
    color: theme.colors.textDark, // Text color
  },
});

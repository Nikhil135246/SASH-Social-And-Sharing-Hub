import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { ScrollView } from "react-native";
import NotificationItem from "../../components/NotificationItem";
import { hp, wp } from "../../helpers/common";
import { fetchNotifications } from "../../services/notificationService";
import { theme } from "../../constants/theme";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    setLoading(true);
    try {
      let res = await fetchNotifications(user.id);
      if (res.success) setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
      <Header title="Notifications"/>
      {loading?(<Loading/>):(
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map((item) => {
            return (
              <NotificationItem item={item} key={item?.id} router={router} />
            );
          })}
          {
            notifications.length==0 && (
              <Text style={styles.noData}>No Notifications yet</Text>
            )
          }
        </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: "center",
  },
});

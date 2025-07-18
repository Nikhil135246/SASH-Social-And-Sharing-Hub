import React, {
  useEffect,
  useCallback,
  memo,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "react-native";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useFocusEffect, useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { getUserData } from "../../services/userService";

let limit = 0;

const Home = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  const [currentlyPlayingPostId, setCurrentlyPlayingPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setnotificationCount] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState({});

  // Redirect to login if there is no user.
  useEffect(() => {
    // if (!user) {
    //   router.replace("./login");
    // }
  }, [user, router]);

  // This hook always runs so that hook order remains consistent.
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        // Reset state when user logs out
        setPosts([]);
        setHasMore(true);
        setCurrentlyPlayingPostId(null);
      }
    }, [user])
  );

  // Cleanup memory on unmount
  useEffect(() => {
    return () => {
      setPosts([]);
      setCurrentlyPlayingPostId(null);
      setAutoPlayEnabled({});
    };
  }, []);

  const handleVideoPlay = useCallback((postId) => {
    setAutoPlayEnabled((prev) => ({ ...prev, [postId]: false }));
    setCurrentlyPlayingPostId((prev) => (prev === postId ? null : postId));
  }, []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems, changed }) => {
      // Reset auto-play for items that leave view
      changed.forEach(({ item, isViewable }) => {
        if (!isViewable && item.file?.includes("postVideos")) {
          setAutoPlayEnabled((prev) => {
            const newState = { ...prev };
            delete newState[item.id];
            return newState;
          });
        }
      });

      // Find first eligible video to play
      const firstVisibleVideo = viewableItems.find(
        ({ item }) =>
          item.file?.includes("postVideos") &&
          (autoPlayEnabled[item.id] ?? true)
      );

      setCurrentlyPlayingPostId(firstVisibleVideo?.item.id || null);
    },
    [autoPlayEnabled]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70,
    minimumViewTime: 300,
  };

  const handlePostEvent = useCallback(async (payload) => {
    console.log("Post event payload:", payload);

    if (payload.eventType === "INSERT" && payload?.new?.id) {
      const newPost = { ...payload.new };
      const res = await getUserData(newPost.userid);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }

    if (payload.eventType === "DELETE" && payload.old.id) {
      setPosts((prev) => prev.filter((post) => post.id !== payload.old.id));
    }

    if (payload.eventType === "UPDATE" && payload?.new?.id) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === payload.new.id
            ? { ...post, body: payload.new.body, file: payload.new.file }
            : post
        )
      );
    }
  }, []);

  const handleNewNotification = useCallback((payload) => {
    console.log("New notification payload:", payload);
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      setnotificationCount((prev) => prev + 1);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      // This runs when the screen gains focus
      return () => {
        // Cleanup when the screen loses focus: stop all videos
        setCurrentlyPlayingPostId(null);
      };
    }, [])
  );

  useEffect(() => {
    if (!user) return;

    const postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    const notificationChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverid=eq.${user?.id}`,
        },
        handleNewNotification
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(notificationChannel);
      setPosts([]);
      setCurrentlyPlayingPostId(null);
    };
  }, [user?.id, handlePostEvent, handleNewNotification]);

  const getPosts = useCallback(async () => {
    if (!hasMore) return;
    
    // Limit total posts to prevent memory issues
    if (posts.length >= 50) {
      setHasMore(false);
      return;
    }
    
    // Instead of increasing limit, use offset-based pagination
    const newLimit = 3; // Reduced from 5 to 3 for memory
    const offset = posts.length;

    console.log("Fetching posts with limit:", newLimit, "offset:", offset);
    const res = await fetchPosts(newLimit, offset);

    if (res.success) {
      if (res.data.length < newLimit) {
        setHasMore(false);
      }
      // Append new posts instead of replacing all
      setPosts(prev => [...prev, ...res.data]);
    } else {
      console.log("fetch post error", res.msg);
    }
  }, [hasMore, posts.length]);

  const renderItem = useCallback(
    ({ item }) => (
      <MemoizedPostCard
        item={item}
        currentUser={user}
        router={router}
        currentlyPlayingPostId={currentlyPlayingPostId}
        setCurrentlyPlayingPostId={setCurrentlyPlayingPostId}
        onVideoPlay={handleVideoPlay}
      />
    ),
    [user, router, currentlyPlayingPostId, handleVideoPlay]
  );

  const ListFooter = useMemo(
    () =>
      hasMore ? (
        <View style={{ marginVertical: posts.length === 0 ? 275 : 30 }}>
          <Loading />
        </View>
      ) : (
        <View style={{ marginVertical: 30 }}>
          <Text style={styles.noPosts}>No more posts</Text>
        </View>
      ),
    [hasMore, posts.length]
  );

  return (
    <ScreenWrapper bg={"white"} paddingTop={hp(2.5)}>
      {/* Always render the same number of hooks.
          If there is no user, render a placeholder (and the redirect effect will run). */}
      {!user ? (
        <View style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>SimpleHub</Text>
            <View style={styles.icons}>
              <Pressable
                onPress={() => {
                  setnotificationCount(0);
                  router.push("./notifications");
                }}
              >
                <Icon
                  name="heart"
                  size={hp(3.2)}
                  strokeWidth={2}
                  color={theme.colors.text}
                />
                {notificationCount > 0 && (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{notificationCount}</Text>
                  </View>
                )}
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

          <FlatList
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
            removeClippedSubviews={true}
            disableVirtualization={false}
            getItemLayout={undefined}
            data={posts}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onEndReached={getPosts}
            onEndReachedThreshold={0.3}
            ListFooterComponent={ListFooter}
            updateCellsBatchingPeriod={200}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            legacyImplementation={false}
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

// Memoized PostCard component to prevent unnecessary re-renders
const MemoizedPostCard = memo(
  PostCard,
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.currentlyPlayingPostId === next.currentlyPlayingPostId &&
    prev.item.body === next.item.body &&
    prev.item.file === next.item.file &&
    prev.item.postLikes?.length === next.item.postLikes?.length &&
    prev.item.comments?.count === next.item.comments?.count &&
    prev.setCurrentlyPlayingPostId === next.setCurrentlyPlayingPostId &&
    prev.item.user?.image === next.item.user?.image
);

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp(-1.5),
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
    backgroundColor: theme.colors.notification,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
});

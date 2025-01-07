import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Image } from 'react-native';

const LoadingAnimated = ({ size = 50, iconSource }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  // Spin animation
  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // 1 second for a full rotationll
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Rotate from 0 to 360 degrees
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={iconSource} // Your custom icon
        style={[
          styles.icon,
          {
            width: size,
            height: size,
            transform: [{ rotate: spin }], // Apply spin animation
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export default LoadingAnimated;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    tintColor: '#3498db', // Optional: Adjust the color of the icon
  },
});

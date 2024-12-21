import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper.jsx'
import { StatusBar } from 'expo-status-bar'
import { wp } from '../helpers/common.js'
import { Image } from 'react-native-web'

const welcome = () => {
  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark"/>
        <View style={styles.container}>
        <Image style={styles.welcomeImage} resizeMode ='contain' source={require('../assets/images/welcome.png')}/>   
        </View>

    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4),
      }
})

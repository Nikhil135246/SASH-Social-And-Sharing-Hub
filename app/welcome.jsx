import { StyleSheet, Text, View ,Pressable} from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper.jsx'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/common'
import { Image } from 'react-native'
import { theme } from '../constants/theme.js'
import Button from '../components/Button.jsx'
import { useRouter } from 'expo-router'
import Login from './login.jsx'
import SignUp from './SignUp.jsx'
const welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')} />
        {/* titel */}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>LinkUp!</Text>
          {/* <Text style={styles.punchline}>Stay in the loop, share your world, and connect authentically.</Text> */}
          <Text style={styles.punchline}>Where your voice is valued, and every connection feels authentic and true.</Text>
        </View>
        {/* yahan se footer start hoga  */}
        <View style={styles.footer}>
          {/* now wwe will make button.jsx inside component jisme apan getstarted wala butoton ka kam karenge  */}
          <View style={styles.footer}>
            <Button
              title="Getting Started"
              buttonStyle={{ marginHorizontal: wp(3) }}
              onPress={() => router.push('SignUp')}
            />
            <View style={styles.bottomTextContainer}>
              <Text style={styles.loginText}>Already have an account!</Text>
              <Pressable onPress={()=> router.push('login')}>
                <Text style={[styles.loginText,{color: theme.colors.primaryDark,fontWeight: theme.fonts.semibold}]}>Login</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </View>

    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    // Set the height of the image to 30% of the device height
    height: hp(35),

    // Set the width of the image to 100% of the device width
    width: wp(100),

    // Center the image within its parent container
    alignSelf: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight: theme.fonts.extraBold,
  },
  punchline: {
    textAlign: 'center',
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
  footer: {
    gap: 30,
    width: '100%',
  },bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  
  loginText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
  }
})

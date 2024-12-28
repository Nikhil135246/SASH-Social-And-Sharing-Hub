// comman headear so that we can use in multiple screens where it needed
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import BackButton from './BackButton'
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'


// mb is margin bottom property 

const Header = ({title, showBackButton =true, mb=10}) => {
    const router = useRouter();
  return (
    <View style={[styles.container,{marginBottom:mb}]}>
      {
        showBackButton && (
            <View style = {styles.backButton}>
                <BackButton router={router}/>
            </View>
        )
      }
      {/* belwo is like tilte show karo if ni ha tho "" show karo  */}
      <Text style = {styles.title}>{title  || ""}</Text> 
    </View>
  )
}

export default Header


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  title: {
    fontSize: hp(2.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
});
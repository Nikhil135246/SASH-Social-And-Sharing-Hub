import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { ActivityIndicator } from 'react-native'

const Loading = ({size ="large", color=theme.colors.loading}) => {
  return (
    <View style={{justifyContent:'center',alignItems:'center'}}> 
    <ActivityIndicator size={size} color={color}/>
      {/* <Text>Loading</Text> */}
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({}) 
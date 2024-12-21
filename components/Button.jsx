import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import Loading from './Loading'

const Button = ({
    buttonStyle, // Style for the button container
    textStyle,   // Style for the button text
    title = "",  // Default title for the button
    onPress = () => {}, // Function to be called on button press
    loading = true,    // Whether the button is currently loading
    hasShadow = true,   //! Whether to display a shadow effect or not toggel karneke kam ayga 
}) => {
    const shadowStyle = {
        shadowColor: theme.colors.dark,  // Color of the shadow
        shadowOffset: { width: 0, height: 10 }, // Offset of the shadow
        shadowOpacity: 0.2, // Opacity of the shadow
        shadowRadius: 8, // Blur radius of the shadow
        elevation: 4, // Elevation for Android shadow
      };
      if (loading) {
        return (
          <View style={[styles.button, buttonStyle, { backgroundColor: 'white' }]} >
            <Loading />
                </View>
        )
      }
  return (
    
    <Pressable onPress={onPress} style={[styles.button, buttonStyle,hasShadow && shadowStyle]}>
         {/* 
    - **onPress={onPress}**: This prop defines the function that will be called when the button is pressed. 
      In this case, it's the `onPress` prop passed to the `Button` component. 
      This allows you to handle the button press event and perform actions like navigating to another screen, 
      submitting data, or triggering other events.

    - **style={[styles.button, buttonStyle, hasShadow && shadowStyle]}**: 
      This prop determines the styling of the button. It's an array that combines:
        - **styles.button**: Default styles defined within the `StyleSheet` (not shown in the snippet). 
          These likely provide basic styling like background color, border radius, etc.
        - **buttonStyle**: Custom styles passed to the component through the `buttonStyle` prop. 
          This allows for flexibility in customizing the button's appearance.
        - **hasShadow && shadowStyle**: This conditionally applies the `shadowStyle` if the `hasShadow` prop is true. 
          This enables or disables the shadow effect on the button.

    - **<Text style={[styles.text, textStyle]}>{title}</Text>**: 
      This renders the button's text. 
      - **style={[styles.text, textStyle]}**: Similar to the `style` prop above, this combines:
        - **styles.text**: Default text styles (likely for color, font size, etc.).
        - **textStyle**: Custom text styles passed through the `textStyle` prop.
      - **{title}**: The actual text content of the button, which is passed to the component through the `title` prop. 
  */}
        {/* here below title is passes by parent compponnet which is in welcome line  */}
      <Text style={[styles.text,textStyle]}>{title}</Text>

    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({

    button: {
        backgroundColor: theme.colors.primary,
        height: hp(6.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl
      },
      
      text: {
        fontSize: hp(2.5),
        color: 'white',
        fontWeight: theme.fonts.bold
      },
})
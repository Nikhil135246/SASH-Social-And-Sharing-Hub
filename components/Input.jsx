import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';

const Input = (props) => {
    // Render a View component that acts as the container for the input.
    return (
      <View 
        // Combine the default container style with any custom styles provided.
        style={[styles.container, props.containerStyles && props.containerStyles]}>
        {/* Conditionally render an icon if the 'icon' prop is provided. */}
        {props.icon && props.icon} 
  
        <TextInput 
          // Make the TextInput occupy all available space within the container.
          style={{ flex: 1 }}
  
          // Set the placeholder text color using the theme.
          placeholderTextColor={theme.colors.textLight} 
  
          // Allow access to the underlying native TextInput component.
          ref={props.inputRef && props.inputRef} 
  
          // Pass any remaining props to the TextInput component.
          {...props} 
        />
      </View>
    );
  };

export default Input

const styles = StyleSheet.create({
    container: {
        // Arrange child elements in a row, horizontally.
        flexDirection: 'row',
      
        // Set the height of the container.
        height: hp(7.2), 
      
        // Vertically center the items within the container.
        alignItems: 'center',
      
        // Horizontally center the items within the container.
        justifyContent: 'center',
      
        // Add a border around the container.
        borderWidth: 0.4,
      
        // Set the border color using a value from the theme.
        borderColor: theme.colors.text,
      
        // Set the border radius using a value from the theme.
        borderRadius: theme.radius.xxl,
      
        // Control how borders are drawn for complex shapes.
        borderCurve: 'continuous', 
      
        // Add horizontal padding to the container.
        paddingHorizontal: 18,
      
        // Add space between child elements.
        gap: 12
      }
})
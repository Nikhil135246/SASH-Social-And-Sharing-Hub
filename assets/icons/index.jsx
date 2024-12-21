import { StyleSheet, Text, View } from 'react-native'; // Import necessary components from react-native
import React from 'react'; // Import React for creating functional components
import Home from './Home'; // Import the Home component (which likely renders an icon)
import { theme } from '../../constants/theme'; // Import theme colors from the theme file

// Create a dictionary to map icon names to their corresponding components
const icons = {
  home: Home, // Map 'home' to the Home component
};

const Icon = ({ name, ...props }) => {
  // Get the icon component based on the provided 'name' prop
  const IconComponent = icons[name];

  // Render the corresponding icon component
  return (
    <IconComponent
      height={props.size || 24} // Default height to 24 if size prop is not provided
      width={props.size || 24} // Default width to 24 if size prop is not provided
      strokeWidth={props.strokeWidth || 1.9} // Default strokeWidth to 1.9 if not provided
      color={theme.colors.textLight} // Use the 'textLight' color from the theme
      {...props} // Pass any other props to the IconComponent
    />
  );
};

export default Icon; // Export the Icon component for use in other parts of your application

const styles = StyleSheet.create({}); // Create a stylesheet for potential future use (currently empty)
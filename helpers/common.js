import { Dimensions } from "react-native";

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
// hp is heigth percentage
export const hp = percentage => {
    return (percentage * deviceHeight) / 100;
  };
export const wp = percentage => {
    return (percentage * deviceWidth) / 100;
  };

// Strip HTML tags from text for sharing
export const stripHtmlTags = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};
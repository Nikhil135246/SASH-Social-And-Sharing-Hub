import { Dimensions } from "react-native";

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
// hp is heigth percentage
export const hp = percentage => {
    return (percentage * deviceHeight) / 100;
  };
export const wp = percentage => {
    return (percentage * deviceWidth) / 100;
  };

  export const stripHtmlTags = (html)=>
  {
    // this okay but not handling a &npsb case 
    // return html.replace(/<[^>]*>/gm,'');
    // (/   / ) eska matalb aap regular expression liksh rahe ho 
    // < ye match karta html tags ko (<div> <p> ...)
    // [^>]* all content jab tak > ni mil jata zero bhi chalega
    //  g means global tag jahan jahan html tag h waha whah ye changes karo srif first ko bs ni karna ha jahan jahan mile har jagahan 
    // m multilines ka bhi dhyan rako multiline strings ke liye hai (yaha jyada use nahi hota, par safe rehne ke liye diya gaya).
    
    
    // Bye niks 
  // First, replace HTML entities like &nbsp; with a regular space
  html = html.replace(/&nbsp;/g, ' '); // Replaces &nbsp; with a space

  // Then, remove any HTML tags
  return html.replace(/<[^>]*>/gm, '');
    
  }
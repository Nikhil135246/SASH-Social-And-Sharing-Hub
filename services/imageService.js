export const getUserImageSrc = imagePath =>{
    if(imagePath)
    {
        return{uri: imagePath}//returning opbject if we found imagepath
    }else{
        return require('../assets/images/defaultUser.png');
    }
}
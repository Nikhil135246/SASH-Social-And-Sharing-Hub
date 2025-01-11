import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';
import Avatar from './Avatar';
import moment from 'moment';
import Icon from '../assets/icons';
import RenderHTML from 'react-native-render-html';
import { Image } from 'expo-image';
import { getSupabaseFileUrl } from '../services/imageService';
import { Video } from 'expo-av';
import { useState } from 'react';
import { createPostLike } from '../services/postService';

const textStyle = {
    color: theme.colors.dark,
    fontSize: hp(1.75)
};
const tagsStyles = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: {
        color: theme.colors.dark
    },
    h4: {
        color: theme.colors.dark
    }
}
const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow = true,
    
}) => {
    // const shadowStyles = {
    //     shadowOffset: {
    //         width: 1,
    //         height: 2
    //     },
    //     shadowOpacity: 0.06,
    //     shadowRadius: 6,
    //     elevation: 1,
    //     shadowColor: theme.colors.primaryDark2
    // }
    const glowingStyles = {
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.8,  // Adjust opacity to make the glow more visible
        shadowRadius: 20,    // Increase the radius to make the glow spread out
        elevation: 5,        // Works for Android (shadow-like effect)
        shadowColor: 'rgba(0, 255, 255, 0.8)', // Change this to a glowing color, e.g., cyan
    };
    
    // console.log('post item: ', item);
    const openPostDetails = () => {
        //leave for now 
    }

    const onLike = async () =>
    {//we call api again here supabse mein like dalne ke liye so we created our 3 function in postservices 
        let data = {
        userid: currentUser?.id,
        postid : item?.id
        }
        let res = await createPostLike(data);
        console.log('res: ',res);
        if(!res.success)
        {
            Alert.alert('Post','Something went wrong!');
        }

    }
   /*    // Toggle fullscreen on video click
      const handleVideoPress = () => {
        setIsFullScreen(!isFullScreen); // toggle fullscreen state
    } */
    //const [isFullScreen, setIsFullScreen] = useState(false); // state to control fullscreen

    const likes=[];
    const liked = false;
    // console.log('post item:',item); this console log is just to check wheather my postlike array showing in items or not 


    const createdAt = moment(item?.created_at).format('MMM D')// formate kar raha date ko MMM D se formate karega according to english month and day
    return (
        // <View style={[styles.container, hasShadow && shadowStyles]}> // vy me sonu and orignal 
        <View style={[styles.container, hasShadow && glowingStyles]}>
            <View style={styles.header}>
                {/* user info  */}
                <View style={styles.userInfo}>
                    <Avatar
                        size={hp(4.5)}
                        uri={item?.user?.image}
                        rounded={theme.radius.md} />

                    <View style={{ gap: 2 }}>
                        <Text style={styles.username}>{item?.user?.name}</Text>
                        <Text style={styles.postTime}>{createdAt}</Text>
                        {/* need to formate the date showing by above item?.created  SO WEHVE TO INSTALL NPM I MOMENT*/}
                    </View>
                </View>
                <TouchableOpacity onPress={openPostDetails}>
                    <Icon name='threeDotsHorizontal' size={hp(4)} strowkewidth={4} color={theme.colors.textDark} />
                </TouchableOpacity>

        </View >
            {/* Post Body & media  */}
            <View style={styles.content}>
                <View style={styles.postBody}>

                    {/*  NOW KYU KI UPER SE JO BODY AYGA WO HTML RAHE GA THO USKE LIYE EK LIBRARY DOWNLOAD KARENGE TAKI USE HTML KO SHOW KAR PAYE ( OR YE KEH LO RENDER KAR PAY ) npm i react-native-render-html*/}
                    {
                        /*  below code if item?.body present ho tabhi run hoga RenderHtml  */
                        item?.body && (
                            <RenderHTML
                                contentWidth={wp(100)}
                                source={{
                                    html:
                                        item?.body || " "

                                    // but we see 3 warning in bottom due to this library but not affect any other thing so we can ignore them 
                                    // by
                                }}
                                tagsStyles={tagsStyles}
                            />
                        )
                    }


                </View>
                {/* post image showing in thiis div */}
                {
                    item?.file && item?.file?.includes('postImages') && (
                        // check if we have the file and its a image file so 
                        // we use inlcude function to check postImages words present in that fileName 
                        // if yes then its an image file 
                        <Image
                            source={getSupabaseFileUrl(item?.file)}
                            transition={100}
                            style={styles.postMedia}
                            contentFit='cover'
                        />
                    )
                }
                {/* post videos */}
                {
                    item?.file && item?.file?.includes('postVideos') && (
                        
                        <Video
                            style={[styles.postMedia, { height: hp(30) }]}
                            source={getSupabaseFileUrl(item?.file)}
                            useNativeControls
                            resizeMode='cover'
                            isLooping
                            // shouldPlay={isFullScreen} // Ensures video plays only in fullscreen mode
                            // isMuted={!isFullScreen} // You can mute video in non-fullscreen mode
                        />
                    
                    )
                }

            </View>
            {/* like, comment, share */}
            <View style = {styles.footer}>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={onLike}>
                        <Icon name="heart" size={24} fill={liked?theme.colors.rose:'transparent'} color ={liked?theme.colors.rose:theme.colors.textLight}/>
                        {/* its color gonna be change when we click so make a const bollear liked = flase initialy  */}
                        {/*  dekho bhaii heart ke icon file mein dekho waha mein as prob ek fill karke option h jo apne yahan se yani 👆parent component se pass kar ke color fill karwa sakte ha  */}
                    </TouchableOpacity>
                    {/* text for like count  */}
                    <Text style ={styles.count}>
                        {
                            likes?.length

                        }
                    </Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity>
                        <Icon name='comment' size={24} color ={theme.colors.textLight}/>{/* its color gonna be change when we click so make a const bollear liked = flase initialy  */}
                        
                    </TouchableOpacity>
                    {/* text for comment count  */}
                    <Text style ={styles.count}>
                        {
                            0
                        }
                    </Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity>
                        <Icon name='share' size={24} color ={theme.colors.textLight}/>{/* its color gonna be change when we click so make a const bollear liked = flase initialy  */}
                        
                    </TouchableOpacity>
                    
                </View>
            </View>
        </View>
    )
}

export default PostCard

/* const styles = StyleSheet.create({

    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000'
    }, */
    const styles = StyleSheet.create({
        container: {
            gap: 10,
            marginBottom: 15,
            borderRadius: theme.radius.xxl * 1.1,
            borderCurve: 'continuous',
            padding: 10,
            paddingVertical: 12,
            backgroundColor: 'white',
            borderWidth: 0.5,
            borderColor: theme.colors.gray,
            shadowColor: '#000',
        },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },

    username: {
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium,
    },

    postTime: {
        fontSize: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },

    content: {
        gap: 10,
        // marginBottom: 10,
    },

    postMedia: {
        height: hp(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous'
    },

    postBody: {
        marginLeft: 5,
    },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },

    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },

    count: {
        color: theme.colors.text,
        fontSize: hp(1.8)
    }

   

})
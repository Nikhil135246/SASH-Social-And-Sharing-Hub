import { ScrollView, Pressable, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { useAuth } from '../../context/AuthContext'
import { getUserImageSrc, uploadFile } from '../../services/imageService'
import Icon from '../../assets/icons'
import Header from '../../components/Header'
import { Image } from 'expo-image'
import { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import { updateUser } from '../../services/userService'
import { router, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
    const { user: currentUser, setUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    // dekho uper wala bhi initially user likhe hua tha per kyu  ki hm 
    // niche wale funciton mem user chaiye tho uper wale ka nam current  user kr diye
    const [user, setUser] = useState({

        name: '',
        phoneNumber: '',
        image: null,
        bio: '',
        address: ''
    })

    // ye marked ha book mark in port player 2h:32m
    // bol raha current user

    useEffect(() => {
        // Check if `currentUser` exists
        if (currentUser) {
            // Update the `user` state with `currentUser` data
            setUser({
                name: currentUser.name || '',       // Set name or default to an empty string
                phoneNumber: currentUser.phoneNumber || '',  // Set phone number or default to empty string
                image: currentUser.image || null,    // Set image or default to null
                address: currentUser.address || '',  // Set address or default to an empty string
                bio: currentUser.bio || '',          // Set bio or default to an empty string
            });
        }
    }, [currentUser]); // Re-run this effect whenever `currentUser` changes

    const onPickImage = async () => {
        // pre requsite to install npx expo install expo-image-picker and import
        // ! for more learnign must visit "docs.expo.dev/versions/latest/sdk/imagepicker/#configuration-in-appjsonappconfigjs" 

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // u can also consider videos like ['image','videos']
            allowsEditing: true,
            aspect: [3, 3],
            quality: 0.7,// originally is 1 but for less data uses ill make it 0.7
        })
        if (!result.canceled) {
            setUser({ ...user, image: result.assets[0] });

            // eske baad apne ye line change kiya line90 : let image...
        }

    }
    const onSubmit = async () => {
        let userData = { ...user };//user ki shallow copy create karna taki unnecassy update no jay apna origanal user 

        let { name, phoneNumber, address, image, bio } = userData;//destucturing simple extracting name , pno. ..etc for easier access form user data
        if (!name || !phoneNumber || !address || !bio || !image) {
            Alert.alert('Profile', "Please fill all the fields!");
            return;
        }
        setLoading(true);
        if (typeof image == 'object') {
            //!  we will have to upload image in database ( for that we have to make bucket in supabase 2:44:48)
            // ! now inside imageService we will write exprot function ''
            let imageRes = await uploadFile('porfiles', image?.uri, true);
            // passing folder name (profile), and uri of image
            if (imageRes.success) userData.image = imageRes.data; //imageRes ko 2 chiz return hogi { ture , data(imagepath)} where data is  itself(data.path)
            else userData.image = null; // u can also throw error but let's not 

        }
        //update user detial

        //res = response 
        const res = await updateUser(currentUser?.id, userData);
        setLoading(false);
        console.log('update user result: ', res);
        // ! yahan tak user table tho update ho chuka per auth taible mein huaa hoga reflect ye 
        // tho ab niche reflect karenge (if upddate sucess then , setuser data ( cureentuser ka deta + just updated data(userData)))
        if (res.success) {
            setUserData({ ...currentUser, ...userData });
            router.back();
        }
    }
    let imageSource = user.image && typeof user.image == 'object' ? user.image.uri : getUserImageSrc(user.image);
    //  condition bola image h and vo object tyep ka ha yani key value  pair tho ( use object se sirf uri wala part do )
    //  agar object ni tho simple getuserImgarsrc se usre ka image do 

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }}>
                    <Header title="Edit Profile" />
                    {/* form */}
                    <View style={styles.form}>
                        <View style={styles.avatarContainer}>
                            <Image source={imageSource} style={styles.avatar} />
                            <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                                <Icon name="camera" size={20} strokeWidth={2.5} />
                            </Pressable>
                        </View>
                        <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                            Please fill your profile details
                        </Text>
                        <Input
                            icon={<Icon name="user" />}
                            placeholder="Enter your name"
                            value={user.name}
                            // uper walla code by defalut user's name show karege 
                            onChangeText={(value) => setUser({ ...user, name: value })
                                //  ye  bol raha jo naya value 
                            }
                        />
                        <Input
                            icon={<Icon name="call" />}
                            placeholder="Enter your phone number"
                            value={user.phoneNumber}
                            // uper walla code by defalut user's name show karege 
                            onChangeText={(value) => setUser({ ...user, phoneNumber: value })
                                //  ye  bol raha jo naya value 
                            }
                        />
                        <Input
                            icon={<Icon name="location" />}
                            placeholder="Enter your address"
                            value={user.address}
                            // uper walla code by defalut user's name show karege 
                            onChangeText={(value) => setUser({ ...user, address: value })
                                //  ye  bol raha jo naya value 
                            }
                        />

                        <Input
                            placeholder="Enter your bio"
                            value={user.bio}
                            multiline={true}
                            containerStyle={styles.bio}
                            // uper walla code by defalut user's name show karege 
                            onChangeText={(value) => setUser({ ...user, bio: value })
                                //  ye  bol raha jo naya value 
                            }
                        />
                        <Button title='Update' loading={loading} onPress={onSubmit} />
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

export default EditProfile

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: wp(4)
    }, avatarContainer: {
        height: hp(14),
        width: hp(14),
        alignSelf: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: theme.radius.xxl * 1.8,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.darkLight,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    }, form: {
        gap: 18,
        marginTop: 20,
    },
    input: {
        flexDirection: 'row',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        padding: 17,
        paddingHorizontal: 20,
        gap: 15
    },
    bio: {
        flexDirection: 'row',
        height: hp(15),
        alignItems: 'flex-start',
        paddingVertical: 10,
    }



})
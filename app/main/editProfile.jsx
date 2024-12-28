import { ScrollView, Pressable, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { useAuth } from '../../context/AuthContext'
import { getUserImageSrc } from '../../services/imageService'
import Icon from '../../assets/icons'
import Header from '../../components/Header'
import { Image } from 'expo-image'
import { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Loading from '../../components/Loading'

const EditProfile = () => {
    const { user: currentUser } = useAuth();
    const[loading,setLoading]=useState(false);
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

    }
    const onSubmit = async ()=>{
        let userData = {...user};
        let{name,phoneNumber,address,image,bio}=userData;
        if(!name||!phoneNumber||!address||!bio)
        {
            Alert.alert('Profile',"Please fill all the fields!");
            return;
        }
        setLoading(true);
        //update user detial

    }
    let imageSource = getUserImageSrc(user.image);
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
                            onChangeText={(value) => setUser({...user,name:value})
                            //  ye  bol raha jo naya value 
                             }
                        />
                        <Input
                            icon={<Icon name="call" />}
                            placeholder="Enter your phone number"
                            value={user.phoneNumber}
                            // uper walla code by defalut user's name show karege 
                            onChangeText={(value) => setUser({...user,phoneNumber:value})
                            //  ye  bol raha jo naya value 
                             }
                        />
                        <Input
                            icon={<Icon name="location" />}
                            placeholder="Enter your address"
                            value={user.address}
                            // uper walla code by defalut user's name show karege 
                            onChangeText={(value) => setUser({...user,address:value})
                            //  ye  bol raha jo naya value 
                             }
                        />
                        
                        <Input
                            placeholder="Enter your bio"
                            value={user.bio}
                            multiline={true}
                            containerStyle={styles.bio}
                            // uper walla code by defalut user's name show karege 
                            onChangeText={(value) => setUser({...user,bio:value})
                            //  ye  bol raha jo naya value 
                             }
                        />
                        <Button title='Update' loading={loading} onPress={onSubmit}/>
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
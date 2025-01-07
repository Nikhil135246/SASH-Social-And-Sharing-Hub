import { StyleSheet, Text, TouchableOpacity, View, Image, Pressable,Alert } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { ScrollView } from 'react-native'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../context/AuthContext'
import RichTextEditor from '../../components/RichTextEditor'
import { useRouter } from 'expo-router'
import { useRef } from 'react'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import * as ImagePicker from 'expo-image-picker'
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av'
import { createOrUpdatePost } from '../../services/postService'
// import { Image } from 'react-native-web'

const NewPost = () => {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(false);// this hook is for if we upload images or videos

  const onPick = async (isImage) => {

    let mediaConfig = {

      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.7,
    }
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ['videos'],
        allowsEditing: true,
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    console.log('file:', result.assets[0])
    // 0 mane aap jab file chonoge tho first file ki baat ho bs 
    // ye console batayga file jo choose kiye uske properties 
    /* file: {"assetId": null, "base64": null, "duration": null, "exif": null, "fileName": "22867607-eaad-4153-b25c-1b3b687f68f7.png", "fileSize": 470971, "height": 1180, "mimeType": "image/png", "rotation": null, "type": "image", "uri": "file:///data/user/0/com.nik1214.SASHapp/cache/ImagePicker/22867607-eaad-4153-b25c-1b3b687f68f7.png", "width": 1180} */
    if (!result.canceled) {

      setFile(result.assets[0]);// jobhi aap file select karoge vo SetFile mein yani mein aajaynga 
    }
  }
  const isLocalFile = file => {
    if (!file) return null;
    if (typeof file == 'object') return true; // bol raha agar file object type ka h yani ki local storage se liye gaya h (tho ture kar do )
    return false;
  }
  const getFileType = file =>{
    if (!file) return null;
    if (isLocalFile(file)) {  
      return file.type;
    }
      
      // will return either video type or image type kyu ki 
      // file apna wahan se aaraha ha (setFile(result.assest[0])); yani ek object ke form mein tho type hoga hi object mein (uri,metadata ,type sab store hota ha )
      
      // check image or video for remort file ( yani jab post edidt karoge tho post thodi local se ayga na vo tho server se ayga na )
      if (file.include('postImages')) {
        //agar file postimaegs se aya yani pakka image file ha 
        return 'image';
      }
      return 'video';// verna video file ha 
    

    }
  
  const getFileUri = file => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri; // ? is just a safty feature bolata agar man lo ye function jo object de raha vo null ya undefind de diya ya uri ha hi ni tho Typeerror dene ki jagah mein boldunga Log:undefiend(better then error)
  }
  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert('Post', 'please choose an Image or add the post body');
      return;
    }
    // agar dono h tho data save karo upload krne ke liye
    let data = {
      file,
      body: bodyRef.current,
      userid: user?.id,

    }
    // creat post 
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    // console.log('post result: ',res);
    if(res.success)
    {
      // console.log('file should be not null now ',file)
      setFile(null);// if post updated set file null 
      bodyRef.current='';
      editorRef.current?.setContentHTML('');
      router.back();
      // console.log('file should be null now ',file)
    }
    else 
    {
      Alert.alert('Post',res.msg);
    }



    // console.log('body: ',bodyRef.current);
    // console.log('file: ',file);

  }

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>

        <Header title="Creat Post" />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          {/* content containerstyle se itemse ke beech gap mil jayga */}
          {/* avatar  */}
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>
                {
                  user && user.name
                }

              </Text>
              <Text style={styles.publicText}>

                public


              </Text>
            </View>
          </View>

          <View style={styles.textEditor}>
            {/* now for editor we use reactnative library (pell rich editor) */}
            <RichTextEditor editorRef={editorRef} onChange={body => bodyRef.current = body} />
            {/* <Pressable style={styles.editIcon} onPress={() => setFile(null)}>
                  <Icon name='edit' size={20} color='white' />
                </Pressable> */}
          </View>
          {
            // if file exsit then we show the view 
            file && (
              <View style={styles.file}>
                {
                  getFileType(file) == 'video' ? (

                    <>
                      <Video
                        style={{
                          flex: 1
                        }}
                        source={{
                          uri: getFileUri(file)
                        }}
                        useNativeControls
                        resizeMode='cover'
                        isLooping />
                    </>


                  ) :
                    (

                      <Image source={{ uri: getFileUri(file) }} resizeMode='cover' style={{ flex: 1 }} />

                    )
                }
                
                <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                  <Icon name='delete' size={20} color='white' />
                </Pressable>
              </View>
            )

          }
          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={33} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>


        </ScrollView>
        <Button
          buttonStyle={{ height: hp(6.2), backgroundColor: theme.colors.primaryDark2 }}
          title="Post"
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />

      </View>

    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },

  title: {
    // marginBottom: 10,
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },

  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },

  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  textEditor: {
    // marginTop: 10,
    // backgroundColor:''
  },

  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray
  },

  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 19
  },

  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  imageIcon: {
    // backgroundColor: theme.colors.gray,
    // borderRadius: theme.radius.md,
    // padding: 6,
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
  },
  borderCurve: 'continuous',
  video: {
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,0,0,0.6)',
    padding: 7,
    borderRadius: 50,

    // shadowColor: theme.colors.textLight,
    // shadowOffset: {width: 0, height: 3},
    // shadowOpacity: 0.6,
    // shadowRadius: 8
  },
  
  editIcon: {
    position: 'absolute',
    top: 8,
    right: 10,
    backgroundColor: 'black',
    padding: 3,
    borderRadius: 50,

    // shadowColor: theme.colors.textLight,
    // shadowOffset: {width: 0, height: 3},
    // shadowOpacity: 0.6,
    // shadowRadius: 8
  }
})
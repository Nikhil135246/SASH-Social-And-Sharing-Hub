import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import { ScrollView } from 'react-native'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../context/AuthContext'
import RichTextEditor from '../../components/RichTextEditor'
import { useRoute } from '@react-navigation/native'
import { useRef } from 'react'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import * as ImagePicker from 'expo-image-picker'

const NewPost = () => {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef("");
  const router = useRoute();
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
    if(!result.canceled)
    {
      setFile(result.assets[0]);// jobhi aap file select karoge vo SetFile mein yani mein aajaynga 
    }
  }
  const onSubmit = async () => {

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

          </View>
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
          buttonStyle={{ height: hp(6.2)  , backgroundColor: theme.colors.primaryDark2}}
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
    // shadowColor: theme.colors.textLight,
    // shadowOffset: {width: 0, height: 3},
    // shadowOpacity: 0.6,
    // shadowRadius: 8
  }
})
import { Alert,Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router';
import Icon from '../assets/icons/index'
import { wp, hp } from '../helpers/common.js'
import Input from '../components/Input'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'


const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Login', "please fill all the fields🥺!");
      return;
    }
    let email =emailRef.current.trim();// will remove unnecassary blankspaces
    let password = passwordRef.current.trim();// will remove unnecassary blankspaces
    setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    // console.log("error: ",error);
    if(error)
    {
      Alert.alert('Login',error.message);
    }
    // good to go we can call the api to check 'supa'
  };
  // just storing pass and email , we can also use useStates  but its verybad , everytime updates when user enter anythgnn unnecassy compputation badhadega
  const [loading, setLoading] = useState(false);
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />
        {/* welcome */}
        
        <View>
          <Text style={styles.welcomeText}>Hey, </Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>
        {/* form */}
        <View style={styles.form}>
          {/* Login message */}
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please login to continue
          </Text>

          {/* Input component with email icon */}
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder='Enter your email'
            onChangeText={value => emailRef.current = value}
          // current value ko dal dega emailref pe 

          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder='Enter your password'
            secureTextEntry
            // passwrod hide ho jay
            onChangeText={value => passwordRef.current = value}

          />
          <Text style={styles.forgotPassword}>
            Forgot Password?
          </Text>

          {/* button for login */}
          <Button title={'Login'} loading={loading} onPress={onSubmit} />
        </View>
        {/* footer */}
        <View style={styles.footer}>
          {/* Render the text "Don't have an account?" with the footerText style */}
          <Text style={styles.footerText}>
            Don't have an account?
          </Text>

          {/* Create a Pressable component for the "Sign up" link */}
          <Pressable onPress={()=>router.push('SignUp')}>
            {/* Render the text "Sign up" within the Pressable component */}
            <Text style = {[styles.footerText, {color: theme.colors.primaryDark, fontWeight:theme.fonts.semibold}]}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(5),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
  }
})
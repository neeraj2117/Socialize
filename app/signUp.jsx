import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Icon from '../assets/icons/index'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Input from '../components/Input'
import Button from '../components/Button'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'


const SignUp = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async() => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current){
        Alert.alert('Login', 'Please fill all the fields');
        return;
    }

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {data: { session }, error} = await supabase.auth.signUp({
      email,
      password,
      options:{
        emailRedirectTo: null,
        data: {
          name
        }
      }
    });

    setLoading(false);

    console.log('session', session);
    console.log('error', error);

    if (error) Alert.alert('Sign Up error', error.message);
  }

  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark"/>
        <View style={styles.container}>
            <BackButton/>

            {/* welcome text */}
            <View>
                <Text style={styles.welcomeText}>Let's </Text>
                <Text style={styles.welcomeText}>Get Started!</Text>
            </View>

            {/* form */}
            <View style={styles.form}>
                <Text style={{fontSize: hp(1.5), color: theme.colors.text, fontSize: 14, fontWeight: theme.fonts.semibold, marginBottom: 5}}>
                    Please fill the details to create an account
                </Text>
                <Input
                    icon={<Icon name="user" size={26} strokeWidth={1.6}/>}
                    placeholder='Enter your name'
                    onChangeText={value => nameRef.current = value}
                />
                <Input
                    icon={<Icon name="mail" size={26} strokeWidth={1.6}/>}
                    placeholder='Enter your mail'
                    onChangeText={value => emailRef.current = value}
                />
                <Input
                    icon={<Icon name="lock" size={26} strokeWidth={1.6}/>}
                    placeholder='Enter your password'
                    secureTextEntry
                    onChangeText={value => passwordRef.current = value}
                />
                
                <View style={{marginTop: 40}}>
                  <Button title={'Sign Up'} loading={loading} onPress={onSubmit}/>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, {fontSize: 15}]}>
                        Already have an account?
                    </Text>
                    <Pressable onPress={() => router.navigate('login')}>
                        <Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold, fontSize: 15}]}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </ScreenWrapper>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5)
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold, 
        color: theme.colors.text,
    },
    form: {
        gap: 20,
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold, 
        color: theme.colors.text,
        paddingRight: 10
    },
    footer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 5,
    },
})

export default SignUp

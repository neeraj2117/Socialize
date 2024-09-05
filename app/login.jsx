import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Icon from '../assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Input from '../components/Input'
import Button from '../components/Button'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'


const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async() => {
    if (!emailRef.current || !passwordRef.current){
        Alert.alert('Login', 'Please fill all the fields');
        return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    
    setLoading(true);

    const {error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    setLoading(false);

    console.log('error', error);

    if (error) Alert.alert('Login error', error.message);
  }

  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark"/>
        <View style={styles.container}>
            <BackButton/>

            {/* welcome text */}
            <View>
                <Text style={styles.welcomeText}>Hey, </Text>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
            </View>

            {/* form */}
            <View style={styles.form}>
                <Text style={{fontSize: hp(1.5), color: theme.colors.text, fontSize: 14, fontWeight: theme.fonts.semibold}}>
                    Please login to continue
                </Text>
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
                <Text style={styles.forgotPassword}>
                   Forgot Password?
                </Text>
                
                <View style={{marginBottom: 5, marginTop: 30}}>
                    <Button title={'Login'} loading={loading} onPress={onSubmit}/>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, {fontSize: 15}]}>
                        Don't have an account?
                    </Text>
                    <Pressable onPress={() => router.navigate('signUp')}>
                        <Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold, fontSize: 15}]}>Sign Up</Text>
                    </Pressable>
                </View>
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
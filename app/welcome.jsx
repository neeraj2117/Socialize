import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

export default function Welcome() {
  const router = useRouter();

  return (
    <ScreenWrapper bg="white">
      <StatusBar style='dark'/>
      <View style={styles.container}>
        {/* welcome image */}
        <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')}/>

        {/* punchline */}
        <View style={{gap: 20}}>
            <Text style={styles.title}>Let's Socialize!</Text>
            <Text style={styles.punchline}>Where every thoughts find a home and every image tells a story.</Text>
        </View>

        {/* footer */}
        <View style={styles.footer}>
            <Button
                title="Get Started"
                buttonStyle={{marginHorizontal: wp(3)}}
                onPress={() => router.push('signUp')}
                style={styles.button}
            />
            <View style={styles.bottomContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <Pressable onPress={() => router.push('login')}>
                    <Text style={[styles.loginText, {color: theme.colors.primary, fontWeight: theme.fonts.semibold, fontSize: 15}]}>
                        Login
                    </Text>
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
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },
    welcomeImage: {
        height: hp(30),
        width: wp(100),
        alignSelf: 'center'
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold
    },
    punchline: {
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        textAlign: 'center',
        color: theme.colors.text
    },
    footer: {
        gap: 23,
        width: '100%'
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
    },
    loginText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.67)
    }
})

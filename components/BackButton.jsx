import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'
import { useRouter } from 'expo-router'

const BackButton = ({size= 26}) => {
  const router = useRouter();
  
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon name='arrowLeft' stokeWidth={2.5} size={size} color={theme.colors.text}/>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 4,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0,0.07)'
    }
})

export default BackButton

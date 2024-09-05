import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Header from "../../components/Header";
import { Image } from "expo-image";
import { useAuth } from "../../context/AuthContext";
import { uploadFile } from "../../services/imageService";
import Icon from "../../assets/icons";
import Input from '../../components/Input'; 
import Button from "../../components/Button";
import { updateUser } from "../../services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
  const { user: currentUser, setUserData } = useAuth();
  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    image: null,
    bio: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || '',
        phoneNumber: currentUser.phoneNumber || '',
        image: currentUser.image || null,
        address: currentUser.address || '',
        bio: currentUser.bio || '',
      });
    }
  }, [currentUser]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
  
    if (!result.canceled && result.assets[0]?.uri) {
      console.log('Setting user image:', result.assets[0].uri);
  
      // Immediately set the selected image's URI
      setUser((prevUser) => ({
        ...prevUser,
        image: result.assets[0].uri,
      }));
  
      // Start the upload process and show loader
      setImageUploading(true);
      let imageRes = await uploadFile('profiles', result.assets[0].uri, true);
      console.log('Image upload result:', imageRes);
      setImageUploading(false);
  
      if (imageRes.success) {
        // Update the image URI with the uploaded file's URI
        setUser((prevUser) => ({
          ...prevUser,
          image: imageRes.data,
        }));
      } else {
        Alert.alert('Image Upload', 'Failed to upload the image. Please try again.');
      }
    }
  };

  const onSubmit = async () => {
    let { name, phoneNumber, address, image, bio } = user;
  
    if (!name || !phoneNumber || !address || !bio || !image) {
      Alert.alert('Profile', 'Please fill all the fields');
      return;
    }
  
    setLoading(true);
  
    // Check if the image is a local file URI (not yet uploaded)
    if (image.startsWith('file://')) {
      let imageRes = await uploadFile('profiles', image, true);
      console.log('Image upload result:', imageRes);
      if (imageRes.success) {
        // Update the image URI in userData to the uploaded file's URI
        setUser((prevUser) => ({
          ...prevUser,
          image: imageRes.data,
        }));
      } else {
        Alert.alert('Image Upload', 'Failed to upload the image. Please try again.');
      }
    }
  
    const res = await updateUser(currentUser?.id, { ...user });
    setLoading(false);
  
    if (res.success) {
      setUserData({ ...currentUser, ...user });
      router.back();
    }
  };

  const baseUrl = "https://libsceixxguqcnleoomj.supabase.co/storage/v1/object/public/uploads";
  const imageSource = user.image
    ? user.image.startsWith("http")
      ? { uri: user.image }
      : { uri: `${baseUrl}/${user.image}` }
    : null;

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image
                source={imageSource || require('../../assets/images/defaultUser.png')}
                style={styles.avatar}
              />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            {imageUploading && (
              <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
            )}
            <Text style={styles.instructionText}>Please fill your profile details</Text>
            <Input
              icon={<Icon name="user" />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={value => setUser({ ...user, name: value })}
            />
            <Input
              icon={<Icon name="call" />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={value => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={<Icon name="location" />}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={value => setUser({ ...user, address: value })}
            />
            <Input
              placeholder="Enter your bio"
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={value => setUser({ ...user, bio: value })}
            />
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center',
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  bio: {
    height: hp(15),
    paddingVertical: 15,
  },
  instructionText: {
    fontSize: hp(1.5),
    color: theme.colors.text,
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: hp(28),
  },
});

export default EditProfile;

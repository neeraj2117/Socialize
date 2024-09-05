import { StyleSheet, View } from "react-native";
import React from "react";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { Image } from "expo-image";
import { getUserImageSrc } from "../services/imageService";

const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style = {},
}) => {
  const imageSource = getUserImageSrc(uri);

  return (
    <View style={[styles.container, { height: size, width: size, borderRadius: rounded }]}>
      <Image
        source={imageSource}
        transition={100}
        style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, style]}
      />
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
    resizeMode: 'cover',
  },
});


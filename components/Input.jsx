// import { StyleSheet, Text, TextInput, View } from 'react-native'
// import React from 'react'
// import { theme } from '../constants/theme'
// import { hp } from '../helpers/common'

// const Input = (props) => {
//   return (
//     <View style={[styles.container, props.containerStyle && props.containerStyles]}>
//       {
//         props.icon && props.icon
//       }
//       <TextInput
//         style={{flex: 1}}
//         multiline={multiline}
//         placeholderTextColor={theme.colors.textLight}
//         ref={props.inputRef && props.inputRef}
//         {...props}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         height: hp(7.2),
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 0.4,
//         borderColor: theme.colors.text,
//         borderRadius: theme.radius.xxl,
//         borderCurve: 'continuous',
//         backgroundColor: theme.colors.background,
//         gap: 12,
//         paddingHorizontal: 18,
//     }
// })

// export default Input


import { StyleSheet, TextInput, View } from 'react-native';
import React from 'react';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';

const Input = ({ icon, containerStyle, multiline, numberOfLines, inputRef, ...props }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon && icon}
      <TextInput
        style={[styles.input, multiline && { height: hp(15) , flex: 1}]}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor={theme.colors.textLight}
        ref={inputRef}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    backgroundColor: theme.colors.background,
    gap: 12,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    paddingVertical: 19,
    paddingHorizontal: 4,
    fontSize: hp(1.7),
  },
});

export default Input;

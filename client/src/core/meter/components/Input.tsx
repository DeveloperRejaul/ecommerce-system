/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import { TextInput, TextInputProps, ViewStyle, Animated, View, Text, StyleSheet, Platform } from 'react-native';
import React, { forwardRef, useRef } from 'react';
import { color } from '../../constants/color';

interface IInputProps extends TextInputProps{
    leftIcon?: React.JSX.Element
    rightIcon?: React.JSX.Element
    containerStyle?:ViewStyle
    inputType?: 'password' | 'text'
    label?:string
    activeBorderColor?:string;
    inActiveBorderColor?:string;
    activeBg?:string;
    inActiveBg?:string;
    error?:string
}
// React.RefAttributes<TextInput>.ref?:
function Input(props:IInputProps, ref:React.Ref<TextInput>) {
  const {
    leftIcon,
    rightIcon,
    containerStyle,
    style,
    label,
    error,
    activeBorderColor = '#fe4487',
    inActiveBorderColor = '#00000023',
    activeBg = 'transparent',
    inActiveBg = '#00000005',
  } = props;
  const animated = useRef(new Animated.Value(0)).current;
  const viewRef = useRef<View>(null);
  const handleBlur = () => {
    if (Platform.OS !== 'web') viewRef.current?.setNativeProps({ borderWidth: 0.8 });
    Animated.timing(animated, {
      toValue: 0,
      useNativeDriver: false,
      duration: 200,
    }).start();
  };

  const handleFocus = () => {
    if (Platform.OS !== 'web') viewRef.current?.setNativeProps({ borderWidth: 1 });
    Animated.timing(animated, {
      toValue: 1,
      useNativeDriver: false,
      duration: 200,
    }).start();
  };

  const animColor = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [inActiveBorderColor, activeBorderColor],
  });

  const animBg = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [inActiveBg, activeBg],
  });

  return (
    <View>
      {label && (
      <Text style={styles.label}>
        {props.label}
      </Text>
      )}
      <Animated.View
        ref={viewRef}
        style={[{ ...styles.container, ...containerStyle }, {
          backgroundColor: animBg,
          borderColor: animColor,
        }]}
      >
        {leftIcon && leftIcon}
        <TextInput
          ref={ref}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...props}
          style={StyleSheet.flatten([styles.input, style])}
        />
        {rightIcon && rightIcon}
      </Animated.View>
      {error && (
      <Text style={styles.error}>
        {error}
      </Text>
      )}
    </View>
  );
}
export default forwardRef(Input);

const styles = StyleSheet.create({
  label: {
    color: '#0000008a',
    fontSize: 15,
    fontWeight: '400',
    paddingBottom: 4,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 7,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 0.8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    // eslint-disable-next-line spaced-comment, @typescript-eslint/ban-ts-comment
    //@ts-ignore
    outlineStyle: 'none',
  },
  error: {
    color: color.error,
    fontSize: 12,
  },
});

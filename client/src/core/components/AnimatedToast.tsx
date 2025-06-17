/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, TextInput, TouchableOpacity, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { color } from '../constants/color';
import { rcp } from '../meter/utils/colorReduceOpacity';
import { CloseIcon } from '../assets/icons/close';

interface IShowData {
  title?: string,
  message: string
  hideDuration?: number,
  bgColor?: string
  titleColor?: string
  messageColor?: string
}

interface IAnimatedToast {
  show: (data: IShowData, cb?: () => void) => void
}

export const animatedToast: IAnimatedToast = {
  show: () => { },
};

const AnimatedInput = Animated.createAnimatedComponent(TextInput);
/**
* A customizable animated alert component that displays a message with optional title and buttons.
* The alert can be shown with customizable content, duration, and styling.
*
* @example
* ```typescript
* import AnimatedAlert from './AnimatedAlert';
*
* // Show an alert with default settings
* AnimatedAlert.show({ message: 'Hello, world!' });
*
* // Show an alert with custom settings
* AnimatedAlert.show({
*   title: 'Important',
*   message: 'This is an important message.',
*   buttons: [
*     { text: 'Cancel', onPress: () => console.log('Cancel pressed') },
*     { text: 'OK', onPress: () => console.log('OK pressed') },
*   ],
*   hideDuration: 2000,
*   bgColor: '#ff0000',
*   titleColor: '#ffffff',
*   messageColor: '#000000',
* }, () => {
*   console.log('Alert dismissed');
* });
*/
export default function AnimatedToast() {
  const { width: WIDTH } = useWindowDimensions();
  const TOAST_WIDTH = 350;
  const OFFSET = WIDTH - TOAST_WIDTH;
  const ANIMATED_VISIBLE_VALUE = 50;
  const ANIMATED_HIDE_VALUE = -100;
  const top = useSharedValue(ANIMATED_HIDE_VALUE);
  const [tostData, setTostData] = useState<IShowData>({} as IShowData);

  useEffect(() => {
    animatedToast.show = function show(data: IShowData, cb?: () => void) {
      setTostData(data);
      top.value = withSpring(ANIMATED_VISIBLE_VALUE, {}, () => {
        top.value = withDelay(data.hideDuration || 1000, withSpring(ANIMATED_HIDE_VALUE, {}, () => {
          if (cb) runOnJS(cb)?.();
        }));
      });
    };
  }, []);

  const hide = () => {
    top.value = withSpring(ANIMATED_HIDE_VALUE);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    display: top.get() === ANIMATED_HIDE_VALUE ? 'none' : 'flex',
  }));

  return (
    <Animated.View
      style={[
        {
          ...styles.container,
          top,
          width: TOAST_WIDTH,
          left: OFFSET / 2,
          right: OFFSET / 2,
          backgroundColor: tostData?.bgColor || color.success,
        }, animatedStyle]}
    >
      <TouchableOpacity
        onPress={hide}
        style={styles.close}
      >
        <CloseIcon color={color.dark} size={20} />
      </TouchableOpacity>
      <AnimatedInput style={{ ...styles.title, color: tostData?.titleColor || color.dark }} editable={false} value={tostData?.title || 'Action Message'} />
      <AnimatedInput style={{ ...styles.message, color: tostData?.messageColor || color.dark }} editable={false} value={tostData.message || ''} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 80,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 0,
  },
  message: {
    fontSize: 14,
    padding: 0,
  },
  close: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: rcp(color.active, 10),
    borderRadius: 20,
    padding: 5,
  },
});

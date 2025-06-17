/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import Animated, { interpolate, runOnJS, runOnUI, setNativeProps, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { color } from '../constants/color';
import { rcp } from '../meter/utils/colorReduceOpacity';
import { CloseIcon } from '../assets/icons/close';
import Button from '../meter/components/Button';
import { breakpoint } from '../constants/constants';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
interface IShowData {
  message: string;
}

interface IAnimatedAlert {
  show: (data: IShowData, cb?: (value: 'cancel' | 'ok') => void) => void
}

export const animatedAlert: IAnimatedAlert = {
  // @ts-ignore
  show: (data: IShowData, cb: (value: string) => void) => { },
};
// @ts-ignore
let callBack: (value: string) => void | null = null;

export default function AnimatedAlert() {
  const { height, width } = useWindowDimensions();
  const textRef = useAnimatedRef();
  const animatedValue = useSharedValue(0);

  useLayoutEffect(() => {
    // @ts-ignore
    animatedAlert.show = show;
  }, []);

  const hide = (value: string) => {
    if (callBack) runOnJS(callBack)(value);
    animatedValue.value = withTiming(0, { duration: 500 });
  };

  const show = (data: IShowData, cb: (value: string) => void) => {
    callBack = cb;
    runOnUI(() => {
      if (Platform.OS === 'web') {
        // @ts-ignore
        textRef.current.value = data.message;
        return;
      }
      setNativeProps(textRef, { text: data.message });
    })();
    animatedValue.value = withTiming(1, { duration: 300 });
  };
  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedValue.value, [1, 0.5], [1, 0], 'clamp'),
    transform: [{ translateX: interpolate(animatedValue.value, [0.5, 0], [0, width], 'clamp') }],
    display: animatedValue.value === 0 ? 'none' : 'flex',
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(animatedValue.value, [1, 0.5], [1, 0.9], 'clamp'),
      },
      {
        translateY: interpolate(animatedValue.value, [1, 0.5], [0, 50], 'clamp'),
      },
    ],
    opacity: interpolate(animatedValue.value, [1, 0], [1, 0], 'clamp'),
    display: animatedValue.value === 0 ? 'none' : 'flex',
  }));

  return (
    <Animated.View style={[styles.body, { height, width }, animatedContainerStyle]}>
      <Animated.View style={[styles.container, { width: breakpoint.md > width ? (width * 0.8) : 400, height: 270 }, animatedStyle]}>
        <View className="flex-row justify-between">
          <Text style={styles.title}>Alert Action </Text>
          <TouchableOpacity
            onPress={() => hide('close')}
            style={styles.close}
          >
            <CloseIcon color={color.dark} size={20} />
          </TouchableOpacity>
        </View>
        <AnimatedTextInput
          ref={textRef}
          style={styles.message}
          editable={false}
          multiline
        />
        <View style={styles.btnContainer}>
          <Button
            text="Cancel"
            containerStyle={{ backgroundColor: rcp(color.active, 20) }}
            textStyle={{ color: rcp(color.dark, 80) }}
            onPress={() => hide('cancel')}
          />
          <Button
            text="Ok"
            containerStyle={{ backgroundColor: rcp(color.active, 20) }}
            textStyle={{ color: rcp(color.dark, 80) }}
            onPress={() => hide('ok')}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: color.weight,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    rowGap: 10,
    justifyContent: 'space-between',
  },

  body: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: rcp(color.dark, 30),
  },
  message: {
    color: rcp(color.dark, 90),
    fontSize: 16,
    flex: 1,
    width: '100%',
    textAlignVertical: 'top',
  },
  close: {
    backgroundColor: rcp(color.active, 10),
    borderRadius: 20,
    padding: 5,
    top: -10,
    right: -10,
  },
  btnContainer: { flexDirection: 'row', alignSelf: 'flex-end', columnGap: 20 },
});

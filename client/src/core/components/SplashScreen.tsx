import { Image, View } from 'react-native';
import React from 'react';
import Logo from '@/src/core/assets/images/adaptive-icon.png';

export default function SplashScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <Image source={Logo} style={{ height: 200, width: 200, resizeMode: 'cover' }} />
    </View>
  );
}

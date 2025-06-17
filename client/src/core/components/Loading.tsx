import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { color } from '../constants/color';

export default function Loading() {
  return (
    <View className="w-full h-full flex justify-center items-center">
      <ActivityIndicator size="large" color={color.active} />
    </View>
  );
}

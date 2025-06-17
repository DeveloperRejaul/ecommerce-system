import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React from 'react';
import { color } from '@/src/core/constants/color';

interface IBadge {
  num:number
  style?:ViewStyle
  textStyle?:TextStyle
}

/**
 * A functional component that renders a badge with a number.
 *
 * @param num - The number to be displayed in the badge.
 * @param style - Optional custom styles for the badge container.
 * @param textStyle - Optional custom styles for the badge text.
 *
 * @returns - A React Native View component representing the badge.
 */
export default function Badge({ num, style, textStyle }:IBadge) {
  return (
    <View style={[styles.budge, style]}>
      <Text style={[styles.budgeText, textStyle]}>{num}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  budge: {
    backgroundColor: color.active,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 10,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgeText: {
    color: color.weight,
    fontSize: 10,
    fontWeight: '600',
  },
});

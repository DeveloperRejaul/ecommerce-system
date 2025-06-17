import { StyleSheet, View, ViewProps } from 'react-native';
import React from 'react';
import { rcp } from '../meter/utils/colorReduceOpacity';
import { color } from '../constants/color';

export default function Divider(props : ViewProps) {
  const { style, ...extra } = props;
  return <View style={[styles.divider, style]} {...extra} />;
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: rcp(color.dark, 15),
  },
});

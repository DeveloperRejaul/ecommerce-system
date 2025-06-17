import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { color } from '@/src/core/constants/color';
import { urlConvert } from '../utils/file';
import avatar from '@/src/core/assets/images/avatar.webp';

interface IAvatarProps {
  src?: string | null,
  size?: number,
  icon?: React.JSX.Element | null
  avatarStyle?: ViewStyle,
}

export default function Avatar(props: IAvatarProps) {
  const { size = 50, icon, src, avatarStyle } = props;
  const RADIUS = size / 2;

  return (
    <View style={[styles.avatarBody, { width: size, height: size, borderRadius: RADIUS }, avatarStyle]}>
      {icon || <Image source={src ? { uri: urlConvert(src) } : avatar} style={styles.img} />}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarBody: {
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: color.active,
    backgroundColor: rcp(color.active, 5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: { width: '100%', height: '100%', resizeMode: 'cover' },
});

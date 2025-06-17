import { Text, useWindowDimensions, View, ViewProps, ViewStyle } from 'react-native';
import React from 'react';

interface IEmptyProps extends ViewProps{
  text?: string
  style?:ViewStyle
}

export default function Empty(props: IEmptyProps) {
  const { text, style, ...extra } = props;
  const { height } = useWindowDimensions();
  const PADDING_BOTTOM = 100;
  return (
    <View
      style={{ height: height - PADDING_BOTTOM, alignItems: 'center', justifyContent: 'center', width: '100%', ...style }}
      {...extra}
    >
      <Text style={{ textAlign: 'center' }}>{ text || 'You have no content'}</Text>
    </View>
  );
}

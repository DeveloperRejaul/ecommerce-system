import { StyleSheet, Text, View, ViewProps } from 'react-native';
import React from 'react';

interface IErrorProps extends ViewProps{
  text?: string
}

export default function Error(props : IErrorProps) {
  const { text, style, ...extra } = props;
  return (
    <View
      style={StyleSheet.flatten([style, { flex: 1, justifyContent: 'center', alignItems: 'center' }])}
      {...extra}
    >
      <Text>
        { text || 'Something went wrong please try again'}
      </Text>
    </View>
  );
}

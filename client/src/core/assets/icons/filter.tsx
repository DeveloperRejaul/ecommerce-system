import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function FilterIcon(props:IconProps) {
  return (
    <Svg viewBox="0 0 32 32" width={props.size} height={props.size} {...props} fill={props.color}>
      <Path d="M18 28h-4a2 2 0 01-2-2v-7.59L4.59 11A2 2 0 014 9.59V6a2 2 0 012-2h20a2 2 0 012 2v3.59a2 2 0 01-.59 1.41L20 18.41V26a2 2 0 01-2 2zM6 6v3.59l8 8V26h4v-8.41l8-8V6z" />
      <Path d="M0 0h32v32H0z" fill="none" />
    </Svg>
  );
}

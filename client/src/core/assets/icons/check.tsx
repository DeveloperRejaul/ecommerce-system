import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function CheckIcon(props:IconProps) {
  return (
    <Svg
      height={props.size || '24px'}
      viewBox="0 -960 960 960"
      width={props.size || '24px'}
      fill={props.color || '#5f6368'}
      {...props}
    >
      <Path d="M382-240L154-468l57-57 171 171 367-367 57 57-424 424z" />
    </Svg>
  );
}

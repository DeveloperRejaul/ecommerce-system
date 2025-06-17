import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function SortIcon(props:IconProps) {
  return (
    <Svg
      height={props.size || 48}
      viewBox="0 0 48 48"
      width={props.size || 48}
      {...props}
      fill={props.color}
    >
      <Path d="M0 0h48v48H0z" fill="none" />
      <Path d="M8 6.2v20.1A6.2 6.2 0 004 32a6 6 0 004 5.6v4.2a2.1 2.1 0 002 2.2 2.1 2.1 0 002-2.2v-4.2a6 6 0 004-5.6 6.2 6.2 0 00-4-5.7V6.2A2.1 2.1 0 0010 4a2.1 2.1 0 00-2 2.2zM12 32a2 2 0 11-2-2 2 2 0 012 2zM22 6.2v4.1a6.2 6.2 0 00-4 5.7 6 6 0 004 5.6v20.2a2 2 0 104 0V21.6a6 6 0 004-5.6 6.2 6.2 0 00-4-5.7V6.2a2 2 0 10-4 0zm4 9.8a2 2 0 11-2-2 2 2 0 012 2zM36 6.2v17.1a6.2 6.2 0 00-4 5.7 6 6 0 004 5.6v7.2a2 2 0 104 0v-7.2a6 6 0 004-5.6 6.2 6.2 0 00-4-5.7V6.2a2 2 0 10-4 0zM40 29a2 2 0 11-2-2 2 2 0 012 2z" />
    </Svg>
  );
}

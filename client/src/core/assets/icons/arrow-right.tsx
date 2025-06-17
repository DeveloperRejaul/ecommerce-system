import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function ArrowRight(props:IconProps) {
  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M9 6l6 6-6 6"
        stroke={props.color || '#000'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

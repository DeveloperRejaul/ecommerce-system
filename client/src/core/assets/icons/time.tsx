import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function TimeIcon(props:IconProps) {
  return (
    <Svg
      viewBox="0 0 512 512"
      height={props.size || 24}
      width={props.size || 24}
      {...props}
    >
      <Path
        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M256 128v144h96"
      />
    </Svg>
  );
}

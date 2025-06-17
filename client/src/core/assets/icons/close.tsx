import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function CloseIcon(props: IconProps) {
  return (
    <Svg
      width={props.size || 25}
      height={props.size || 25}
      viewBox="0 0 512 512"
      {...props}
    >
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M368 368L144 144m224 0L144 368"
      />
    </Svg>
  );
}

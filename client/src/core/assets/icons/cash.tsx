import * as React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { IconProps } from './types';

export function CashIcon(props:IconProps) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 512 512"
      {...props}
    >
      <Rect
        x={32}
        y={80}
        width={448}
        height={256}
        rx={16}
        ry={16}
        transform="rotate(180 256 208)"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M64 384h384M96 432h320"
      />
      <Circle
        cx={256}
        cy={208}
        r={80}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <Path
        d="M480 160a80 80 0 01-80-80M32 160a80 80 0 0080-80m368 176a80 80 0 00-80 80M32 256a80 80 0 0180 80"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </Svg>
  );
}

import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from './types';

export function TextIcon(props:IconProps) {
  return (
    <Svg
      fill="none"
      height={24}
      viewBox="0 0 24 24"
      width={24}
      {...props}
    >
      <G
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <Path d="M2.67 7.17V5.35c0-1.15.93-2.07 2.07-2.07h14.52c1.15 0 2.07.93 2.07 2.07v1.82M12 20.72V4.11M8.06 20.72h7.88" />
      </G>
    </Svg>
  );
}

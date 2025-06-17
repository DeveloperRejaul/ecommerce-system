import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export function ScissorsIcon(props:IconProps) {
  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        stroke={props.color || '#000'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 6c-3.573 2.225-5.943 3.854-8.55 6M20 18c-2.626-1.636-4.602-2.949-6.5-4.382M8.598 9.54a3 3 0 10-3.196-5.08 3 3 0 003.196 5.08zm0 0A89.3 89.3 0 0011.45 12m-2.852 2.46a3 3 0 10-3.196 5.079 3 3 0 003.196-5.078zm0 0A89.287 89.287 0 0111.45 12"
      />
    </Svg>
  );
}

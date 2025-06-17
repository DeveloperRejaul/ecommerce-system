import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function ClockIcon(props:IconProps) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      width={props.size || 24}
      height={props.size || 24}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        color={props.color || '#000'}
      />
    </Svg>
  );
}

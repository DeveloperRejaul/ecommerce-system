import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function GiftIcon(props:IconProps) {
  return (
    <Svg
      height={props.size || 24}
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      fill="none"
      width={props.size || 24}
      {...props}
    >
      <Path
        d="M20 12v9.4a.6.6 0 01-.6.6H4.6a.6.6 0 01-.6-.6V12M21.4 7H2.6a.6.6 0 00-.6.6v3.8a.6.6 0 00.6.6h18.8a.6.6 0 00.6-.6V7.6a.6.6 0 00-.6-.6zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

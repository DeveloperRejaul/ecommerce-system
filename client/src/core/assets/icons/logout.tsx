import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function LogoutIcon(props:IconProps) {
  return (
    <Svg
      fill="none"
      height={props.size || 15}
      viewBox="0 0 15 15"
      width={props.size || 15}
      {...props}
    >
      <Path
        clipRule="evenodd"
        d="M1 1h7v1H2v11h6v1H1zm9.854 3.146l3.34 3.34-3.327 3.603-.734-.678L12.358 8H4V7h8.293l-2.147-2.146z"
        fill={props.color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

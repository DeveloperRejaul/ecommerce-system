import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function LocationIcon(props:IconProps) {
  return (
    <Svg
      height={props.size || 32}
      viewBox="0 0 32 32"
      width={props.size || 32}
      {...props}
      fill={props.color}
    >
      <Path d="M16 18a5 5 0 115-5 5.006 5.006 0 01-5 5zm0-8a3 3 0 103 3 3.003 3.003 0 00-3-3z" />
      <Path d="M16 30l-8.435-9.949a35.076 35.076 0 01-.349-.451A10.889 10.889 0 015 13a11 11 0 0122 0 10.884 10.884 0 01-2.215 6.597l-.001.003s-.3.394-.345.447zM8.812 18.395c.002 0 .234.308.287.374L16 26.908l6.91-8.15c.044-.055.278-.365.279-.366A8.901 8.901 0 0025 13a9 9 0 10-18 0 8.905 8.905 0 001.813 5.395z" />
      <Path d="M0 32V0h32v32z" fill="none" />
    </Svg>
  );
}

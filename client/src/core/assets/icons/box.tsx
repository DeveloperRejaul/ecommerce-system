import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from './types';

export function BoxIcon(props: IconProps) {
  return (
    <Svg fill="none" height={props.size || '24'} viewBox="0 0 24 24" width={props.size || '24'} {...props}>
      <G stroke={props.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <Path d="m3.16992 7.43994 8.82998 5.10996 8.77-5.07999" />
        <Path d="m12 21.61v-9.07" />
        <Path d="m2.39062 9.17007c0-1.38.98999-3.05998 2.19999-3.72998l5.33999-2.97003c1.14-.63 3.01-.63 4.15 0l5.34 2.97003c1.21.67 2.2 2.34998 2.2 3.72998v5.65003c0 1.38-.99 3.06-2.2 3.73l-5.34 2.97c-1.14.63-3.01.63-4.15 0l-5.33999-2.97c-1.21-.67-2.19999-2.35-2.19999-3.73v-.82" />
        <Path d="m16.9998 13.2401v-3.65996l-6.0701-3.51001-1.04994-.60004-2.36999-1.36999" />
      </G>
    </Svg>
  );
}

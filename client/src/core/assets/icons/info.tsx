import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from './types';

export function InfoIcon(props: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...props} width={props.size || 24} height={props.size || 24}>
      <G id="SVGRepo_bgCarrier" strokeWidth="0" />
      <G id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <G id="SVGRepo_iconCarrier">
        <G id="Warning / Info">
          <Path id="Vector" d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z" stroke={props.color || '#000000'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      </G>
    </Svg>
  );
}

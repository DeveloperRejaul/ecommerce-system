import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function MoreIcon(props: IconProps) {
  return (
    <Svg height={props.size || '24'} viewBox="0 0 24 24" width={props.size || '24'} onPress={props.onPress}>
      <Path d="M0 0h24v24H0z" fill="none" />
      <Path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill={props.color || '#000'} />
    </Svg>
  );
}

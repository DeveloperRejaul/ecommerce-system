import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function ProfileIcon(props: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill={props.color} {...props}>
      <Path d="M12,11A5,5,0,1,0,7,6,5.006,5.006,0,0,0,12,11Zm0-8A3,3,0,1,1,9,6,3,3,0,0,1,12,3ZM3,22V18a5.006,5.006,0,0,1,5-5h8a5.006,5.006,0,0,1,5,5v4a1,1,0,0,1-2,0V18a3,3,0,0,0-3-3H8a3,3,0,0,0-3,3v4a1,1,0,0,1-2,0Z" />
    </Svg>
  );
}

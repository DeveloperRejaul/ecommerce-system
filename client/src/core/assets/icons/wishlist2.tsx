import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function Wishlist2Icon(props: IconProps) {
  return (
    <Svg
      enable-background="new 0 0 64 64"
      viewBox="0 0 64 64"
      {...props}
      width={props.size || 25}
      height={props.size || 25}
    >
      <Path
        fill={props.color}
        d="m61.072 17.583c-6.394-17.623-27.154-9.716-29.074-.915-2.641-9.379-22.89-16.376-29.07.928-6.881 19.273 26.67 36.57 29.07 39.404 2.398-2.252 35.953-20.457 29.074-39.417"
      />
    </Svg>
  );
}

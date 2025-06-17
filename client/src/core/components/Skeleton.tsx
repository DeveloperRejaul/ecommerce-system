'use client';

import { useEffect } from 'react';
import { DimensionValue } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface ISkeletonProps {
  hight?: DimensionValue | undefined;
  width?:DimensionValue | undefined;
  rounded?: number
}

export default function Skeleton(props: ISkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.9, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [opacity]);

  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      opacity.value,
      [0.5, 0.9],
      ['#d3d3d3', '#ebe8e8'],
    );
    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[
        animatedColor,
        {
          opacity,
          height: props.hight || 200,
          width: props.width || 200,
          borderRadius: props.rounded || 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      ]}
    />
  );
}

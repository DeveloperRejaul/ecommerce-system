'use client';

import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import Skeleton from '../Skeleton';

/**
 * A component that renders a skeleton layout for the "Please Login" screen.
 * The skeleton layout consists of multiple Skeleton components with different dimensions and styles.
 *
 * @returns {JSX.Element} - The JSX element representing the "Please Login" skeleton layout.
 */
export default function SquareCardSkeleton() {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = (width / 2) - 25;
  return (
    <View className="gap-y-1">
      <Skeleton hight={170} width={CARD_WIDTH} rounded={5} />
      <Skeleton hight={10} width={CARD_WIDTH - 50} rounded={5} />
      <Skeleton hight={30} width={CARD_WIDTH} rounded={5} />
      <Skeleton hight={10} width={50} rounded={5} />
      <Skeleton hight={10} width={70} rounded={5} />
    </View>
  );
}

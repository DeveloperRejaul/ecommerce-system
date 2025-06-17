'use client';

import React from 'react';
import { View } from 'react-native';
import Skeleton from '../Skeleton';

/**
 * A component that renders a skeleton layout for the "Please Login" screen.
 * The skeleton layout consists of multiple Skeleton components with different dimensions and styles.
 *
 * @returns {JSX.Element} - The JSX element representing the "Please Login" skeleton layout.
 */
export default function CategorySkeleton() {
  return (
    <View className="gap-y-2 justify-center items-center">
      <Skeleton hight={50} width={50} rounded={70} />
      <Skeleton hight={10} width={55} rounded={10} />
    </View>
  );
}

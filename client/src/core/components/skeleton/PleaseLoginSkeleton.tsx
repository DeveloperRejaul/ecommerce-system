'use client';

import { StyleSheet, View } from 'react-native';
import React from 'react';
import Skeleton from '../Skeleton';

/**
 * A component that renders a skeleton layout for the "Please Login" screen.
 * The skeleton layout consists of multiple Skeleton components with different dimensions and styles.
 *
 * @returns {JSX.Element} - The JSX element representing the "Please Login" skeleton layout.
 */
export default function PleaseLoginSkeleton() {
  return (
    <View style={styles.container} className="container">
      <Skeleton hight={250} width={300} rounded={70} />
      <Skeleton hight={60} width="40%" />
      <Skeleton hight={100} width="100%" />
      <Skeleton hight={60} width="100%" />
      <Skeleton hight={60} width="100%" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 10, alignItems: 'center', rowGap: 10 },
});

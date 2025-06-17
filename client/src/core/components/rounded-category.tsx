import { Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Avatar from './avatar';
import type { IRoundedCategory } from '@/types';
import { color } from '../constants/color';
import CategorySkeleton from './skeleton/categorySkeleton';

export default function RoundedCategory(props: IRoundedCategory) {
  const handlePress = (title:string) => {
    if (title === 'More') router.push('/(tab)/category');
    else router.push({ pathname: '/product', params: { filter: props.text, id: props.id } });
  };

  if (props.isLoading) return <CategorySkeleton />;
  return (
    <Pressable
      className="flex-grow"
      onPress={() => handlePress(props.text)}
      style={styles.categoryBoxBody}
    >
      <Avatar src={props.avatar} icon={props.icon} />
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  categoryBoxBody: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    padding: 2,
  },
  text: {
    textAlign: 'center',
    color: color.dark,
  },
});

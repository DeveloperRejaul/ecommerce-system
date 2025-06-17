import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Button from '../meter/components/Button';
import { color } from '../constants/color';

interface ISquareCategory {
  index:number;
  text:string;
  avatar:string
  isLoading?:boolean
}

export default function SquareCategory(props:ISquareCategory) {
  return (
    <View key={Math.random()} style={styles.categorySpacial}>
      <Image source={{ uri: props.avatar }} style={styles.img} />
      <View style={styles.textBody}>
        <Text style={styles.name}>{props.text}</Text>
        <Text style={styles.text}>Collections</Text>
      </View>
      <Button
        text="Shop Now"
        onPress={() => router.navigate({ pathname: '/(stack)/product/', params: { filter: props.text } })}
        containerStyle={{ backgroundColor: (props.index % 2) === 0 ? color.active : color.primary }}
        textStyle={{ color: color.weight }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  categorySpacial: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 30,
  },
  textBody: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: color.weight,
    fontSize: 25,
    fontWeight: 'bold',
  },
  text: {
    color: color.weight,
    fontSize: 25,
  },
});

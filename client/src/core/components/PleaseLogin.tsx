import { Text, StyleSheet, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Button from '../meter/components/Button';
import { color } from '../constants/color';
import { rcp } from '../meter/utils/colorReduceOpacity';
import ComputerIcon from '../assets/icons/computer';

export default function PleaseLogin() {
  return (
    <View style={styles.container} className="container">
      <View style={{ marginLeft: 15, alignItems: 'center' }}>
        <ComputerIcon color={color.inactive} />
      </View>
      <Text style={styles.hello}>Welcome!</Text>
      <Text style={styles.subText}>Discover a world of opportunities. Please log in or register to get started!</Text>
      <Button
        text="Login"
        onPress={() => {
          router.navigate('/(stack)/auth');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    rowGap: 20,
  },
  hello: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: color.primary,
  },
  subText: {
    textAlign: 'center',
    fontSize: 16,
    color: rcp(color.dark, 70),
  },
});

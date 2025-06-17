import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { InfoIcon } from '../core/assets/icons/info';
import { color } from '../core/constants/color';
import { rcp } from '../core/meter/utils/colorReduceOpacity';
import Header from '../core/components/header';
import { ArrowRight } from '../core/assets/icons/arrow-right';

export default function NotFound() {
  return (
    <>
      <Header text="Not Found" iconLeft={<ArrowRight style={{ transform: [{ rotate: '180deg' }], marginRight: 15 }} />} />
      <View style={styles.container}>
        <InfoIcon size={50} color={rcp(color.dark, 70)} />
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.message}>The page you are looking for does not exist.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  message: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

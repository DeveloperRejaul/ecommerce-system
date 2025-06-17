/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { color } from '../../constants/color';

interface ICountDown {
    onEnd?: (value: boolean) => void;
    action?: 'resend' | null
}

const MAX_COUNT = 300;
let interval:NodeJS.Timeout;
export default function CountDown(props: ICountDown) {
  const { onEnd, action } = props;
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    handleCountDown();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (action === 'resend') {
      setSeconds(0);
      handleCountDown();
    }
  }, [action]);

  const handleCountDown = () => {
    interval = setInterval(() => {
      setSeconds((prev) => {
        if (MAX_COUNT > prev) {
          return prev + 1;
        }
        clearInterval(interval);
        onEnd?.(true);
        return prev;
      });
    }, 1000);
  };

  const sec = seconds < 60 ? seconds : seconds % 60;
  const min = Math.floor(seconds / 60);

  return (
    <Text style={styles.counter}>
      {min.toString().padStart(2, '0')}
      :
      {sec.toString().padStart(2, '0')}
    </Text>
  );
}

const styles = StyleSheet.create({
  counter: {
    textAlign: 'center',
    color: color.active,
    fontSize: 17,
  },
});

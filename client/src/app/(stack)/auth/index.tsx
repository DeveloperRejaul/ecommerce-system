/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { router, useLocalSearchParams } from 'expo-router';
import Input from '@/src/core/meter/components/Input';
import Button from '@/src/core/meter/components/Button';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { useGetShopQuery } from '@/src/core/rtk/shop-api';
import { useLoginMutation } from '@/src/core/rtk/user-api';

export default function Index() {
  const { height } = useWindowDimensions();
  const params = useLocalSearchParams();
  const { data } = useGetShopQuery(undefined);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [login, { isLoading, isSuccess }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      if (params.from === 'CART') {
        router.replace({ pathname: '/cart/order', params: { data: params.data } });
        return;
      }
      router.replace('/(tab)');
    }
  }, [isSuccess]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.container, { height }]} className="container">
        <Image source={{ uri: data?.avatar }} style={styles.avatar} />
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={[styles.text, { paddingBottom: 20 }]}>Welcome back you've been missed!</Text>
        <View style={{ rowGap: 10 }}>
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: {
                message: 'Invalid email address',
                value: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Type email here"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label="Email"
                error={errors.email?.type === 'required' ? 'Email is required' : errors.email?.message}
              />
            )}
            name="email"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Type password here"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label="Password"
                inputType="password"
                error={errors.password?.type === 'required' ? 'Password is required' : errors.password?.message}
              />
            )}
            name="password"
          />
          <Button
            text="Login"
            onPress={handleSubmit((data) => login(JSON.stringify(data)))}
            isDisabled={isLoading}
            isLoading={isLoading}
            containerStyle={{ marginTop: 12 }}
          />
          <View style={styles.row}>
            <Text style={[styles.text]}>Forgot password?</Text>
            <TouchableOpacity onPress={() => router.navigate('/auth/mail')}>
              <Text style={[styles.text, { color: color.active }]}>Reset here</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.btnText}>Don’t have an account?</Text>
          <Button
            onPress={() => {
              router.push('/auth/register');
            }}
            text="Register now"
            variant="outline"
            textStyle={{ color: color.active }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '99%' },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    color: rcp(color.dark, 70),
  },
  btnText: {
    fontSize: 15,
    textAlign: 'center',
    color: color.dark,
    paddingVertical: 10,
  },
  avatar: { height: 100, width: 100, borderRadius: 100, marginTop: -100, marginBottom: 50, alignSelf: 'center' },
});

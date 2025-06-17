import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { router } from 'expo-router';
import Input from '@/src/core/meter/components/Input';
import Button from '@/src/core/meter/components/Button';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { ArrowLeft } from '@/src/core/assets/icons/arrow-left';
import { useVerifyEmailMutation } from '@/src/core/rtk/user-api';

export default function Mail() {
  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '' } });
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  return (
    <View style={styles.container} className="container">
      {Platform.OS !== 'web' && (
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.back()}
      >
        <ArrowLeft />
      </TouchableOpacity>
      )}
      <View style={styles.messageBody}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subTitle}>Enter your email to receive a mail and reset your password</Text>
      </View>
      <View style={styles.inputBody}>
        <Controller
          control={control}
          rules={{
            required: { value: true, message: 'Email is required' },
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
              label="Email Address"
              error={errors.email?.message}
            />
          )}
          name="email"
        />
        <Button
          isLoading={isLoading}
          onPress={handleSubmit(verifyEmail)}
          text="Continue"
          containerStyle={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: color.dark,
  },
  inputBody: {
    rowGap: 20,
  },
  subTitle: {
    fontSize: 15,
    marginBottom: 20,
    color: rcp(color.dark, 80),
  },
  btn: {
    backgroundColor: rcp(color.active, 5),
    width: 40,
    height: 40,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  messageBody: {
    paddingVertical: 60,
  },
});

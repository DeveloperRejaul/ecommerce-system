import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { router, useLocalSearchParams } from 'expo-router';
import Input from '@/src/core/meter/components/Input';
import Button from '@/src/core/meter/components/Button';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { ArrowLeft } from '@/src/core/assets/icons/arrow-left';
import { useResetPasswordMutation } from '@/src/core/rtk/user-api';

interface IPasswordResetData {
    password: string;
    confirmPassword: string;

}

export default function Password() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const params = useLocalSearchParams();
  const { control, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { password: '', confirmPassword: '' } });

  const handleResetPassword = ({ password }: IPasswordResetData) => {
    resetPassword({ password, token: params.token as string });
  };
  return (
    <View style={styles.container} className="container">
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.back()}
      >
        <ArrowLeft />
      </TouchableOpacity>
      <View style={styles.messageBody}>
        <Text style={styles.title}>Create new password?</Text>
        <Text style={styles.subTitle}>Your password must be different from prevues use password</Text>
      </View>
      <View style={styles.inputBody}>
        <Controller
          control={control}
          rules={{
            required: { value: true, message: 'Password is required' },
            minLength: { value: 6, message: 'Min value must be greater than 6' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Type password here"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Password"
              error={errors.password?.message}
              inputType="password"
            />
          )}
          name="password"
        />
        <Controller
          control={control}
          rules={{
            required: { value: true, message: 'Confirm password is required' },
            minLength: { value: 6, message: 'Min value must be greater than 6' },
            validate: (value) => value === watch('password') || 'Passwords do not match',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              inputType="password"
              placeholder="Type confirm password here"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Confirm password"
              error={errors.confirmPassword?.message}
            />
          )}
          name="confirmPassword"
        />
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          onPress={handleSubmit(handleResetPassword)}
          text="Reset Password"
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

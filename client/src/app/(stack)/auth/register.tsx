/* eslint-disable react/no-unescaped-entities */
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/src/core/meter/components/Input';
import Button from '@/src/core/meter/components/Button';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { CheckBox } from '@/src/core/meter/components/CheckBox';
import { CheckIcon } from '@/src/core/assets/icons/check';
import { useGetShopQuery } from '@/src/core/rtk/shop-api';
import { useSingUpMutation } from '@/src/core/rtk/user-api';
import { IRegisterFormDataTypes } from '@/types';
import { animatedToast } from '@/src/core/components/AnimatedToast';

export default function Register() {
  const { height } = useWindowDimensions();
  const { data } = useGetShopQuery(undefined);
  const [singUp, { isLoading }] = useSingUpMutation();
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      isCheck: false,
    },
  });

  const handleSubmitForm = (data:IRegisterFormDataTypes) => {
    const { isCheck, email, name, password } = data;
    if (!isCheck) {
      animatedToast.show({ bgColor: color.error, title: 'Registration Warning', message: 'You need to agree terms and conditions' });
      return;
    }

    singUp({ password, name, email });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.container, { height }]} className="container">
        <Image source={{ uri: data?.avatar }} style={styles.avatar} />
        <Text style={styles.title}>Create account Free</Text>
        <Text style={[styles.text, { paddingBottom: 20 }]}>Create an account to continue!</Text>
        <View style={{ rowGap: 10 }}>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Type username here"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label="User name"
                error={errors.email?.type === 'required' ? 'User name is required' : errors.name?.message}
              />
            )}
            name="name"
          />
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
                label="Email"
                error={errors.email?.message}
              />
            )}
            name="email"
          />
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
            text="Register"
            isDisabled={isLoading}
            isLoading={isLoading}
            onPress={handleSubmit(handleSubmitForm)}
          />
          <View style={styles.row}>
            <CheckBox
              checkIcon={<CheckIcon size={15} color={color.weight} />}
              boxStyle={{ borderColor: color.active }}
              boxActiveStyle={{ backgroundColor: color.active }}
              onChange={(value) => {
                setValue('isCheck', value as boolean);
              }}
            />
            <Text style={[styles.text, { color: color.dark }]}>I agree to all Terms, Privacy Policy and fees</Text>
          </View>
          <Text style={styles.btnText}>Already have an account ?</Text>
          <Button
            onPress={() => router.back()}
            text="Continue with email"
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
  row: { flexDirection: 'row', width: '99%', alignItems: 'center', columnGap: 10, paddingBottom: 20, paddingTop: 10 },
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
  avatar: { height: 100, width: 100, borderRadius: 100, alignSelf: 'center', marginBottom: 40 },
});

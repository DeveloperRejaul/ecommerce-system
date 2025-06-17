/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import type { IAddress } from 'types';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import Input from '@/src/core/meter/components/Input';
import { color } from '@/src/core/constants/color';
import { rcp, reRcp } from '@/src/core/meter/utils/colorReduceOpacity';
import Button from '@/src/core/meter/components/Button';
import { createAddress, updateAddress } from '@/src/core/db-operations/address';
import { CheckBox } from '@/src/core/meter/components/CheckBox';
import { CheckIcon } from '@/src/core/assets/icons/check';
import { animatedToast } from '@/src/core/components/AnimatedToast';
import { getAuthUser } from '@/src/core/db-operations/auth';
import gstyle from '@/gstyle';

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

export default function Address() {
  // @ts-ignore
  const params = useLocalSearchParams<Omit<IAddress, 'isDefault'> & { isDefault: string, from:'UPDATE' | 'CREATE' | 'CART', data: string}>();
  const isUpdate = params.from === 'UPDATE';
  const isCreate = params.from === 'CREATE';
  const isCart = params.from === 'CART';

  const colorValue = useSharedValue(isUpdate ? (params.type === 'home' ? 0 : 1) : 0);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<IAddress>({
    defaultValues: {
      type: params?.type || 'home',
      name: params?.name || '',
      address: params?.address || '',
      town: params?.town || '',
      district: params?.district || '',
      state: params?.state || '',
      code: params?.code || '',
      phone: params?.phone || '',
      isDefault: (params?.isDefault === 'true') || false,
    },
  });
  const animatedHomeStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(colorValue.value, [0, 1], [color.active, reRcp(color.dark, 20)]),
  }));
  const animatedOfficeStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(colorValue.value, [0, 1], [reRcp(color.dark, 20), color.active]),
  }));

  const handleFromSubmit = async (data: IAddress) => {
    const isSuccess = await createAddress(data);
    if (isSuccess) {
      if (isCreate) {
        router.back();
      } else {
        // check user authorization
        const user = await getAuthUser();
        if (!user) {
          animatedToast.show({ message: 'Please login for order', title: 'Login', bgColor: color.error });
          router.navigate({ pathname: '/(stack)/auth/', params: { from: 'CART', data: params.data } });
          return;
        }
        router.replace({ pathname: '/cart/order', params: { data: params.data } });
      }
      animatedToast.show({ title: 'Address Saved', message: 'Successfully create new address' });
    }
  };

  const handleFromSubmitUpdate = async (data: IAddress) => {
    const isSuccess = await updateAddress(data, Number(params.id));
    if (isSuccess) {
      router.back();
      animatedToast.show({ title: 'Address Updated', message: 'Successfully update new address' });
    }
  };

  return (
    <>
      <Header
        text="Add delivery address"
        iconLeft={Platform.OS === 'web' ? <View /> : <ArrowRight style={{ transform: [{ rotate: '180deg' }], marginRight: 10 }} />}
      />
      <View style={gstyle.divider} />
      <ScrollView
        contentContainerStyle={styles.container}
        contentContainerClassName="container"
      >
        <View style={styles.contact}>
          <Text style={styles.title}>Contact Details</Text>
          <Controller
            name="name"
            rules={{ required: { value: true, message: 'Name is required' }, maxLength: { value: 30, message: 'Name is too long' } }}
            control={control}
            render={({ field: { onChange, value } }) => <Input placeholder="Type your name " label="Full Name" onChangeText={onChange} value={value} error={errors.name?.message} />}
          />
          <Controller
            name="phone"
            rules={{
              minLength: { value: 11, message: 'Number is 11 charter' },
              maxLength: { value: 11, message: 'Number is too long' },
              required: { value: true, message: 'Mobile number is required' },
              pattern: { value: /^[0-9]+$/, message: 'Input must number charter' },
            }}
            control={control}
            render={({ field: { onChange, value } }) => <Input keyboardType="phone-pad" placeholder="Type your mobile no." label="Mobile No." onChangeText={onChange} value={value} error={errors.phone?.message} />}
          />
        </View>
        <View style={styles.contact}>
          <Text style={styles.title}>Address</Text>
          <Controller
            name="code"
            control={control}
            rules={{ required: true, pattern: { value: /^[0-9]+$/, message: 'Input must number charter' } }}
            render={({ field: { onChange, value } }) => <Input placeholder="Type your Pin Code " label="Pin Code" keyboardType="number-pad" onChangeText={onChange} value={value} error={errors.code?.message} />}
          />
          <Controller
            name="address"
            control={control}
            rules={{ required: { value: true, message: 'Address is required' }, maxLength: { value: 100, message: 'Address max length 100 charter' } }}
            render={({ field: { onChange, value } }) => <Input placeholder="Type your address" label="Address" onChangeText={onChange} value={value} error={errors.address?.message} />}
          />
          <Controller
            name="town"
            control={control}
            rules={{ required: { value: true, message: 'Town name is required' } }}
            render={({ field: { onChange, value } }) => <Input placeholder="Type your Locality/Town" label="Locality/Town" onChangeText={onChange} value={value} error={errors.town?.message} />}
          />
          <Controller
            name="district"
            control={control}
            rules={{ required: { value: true, message: 'District name is required' } }}
            render={({ field: { onChange, value } }) => <Input placeholder="Type your City/District" label="City/District" onChangeText={onChange} value={value} error={errors.district?.message} />}
          />
          <Controller
            name="state"
            control={control}
            rules={{ required: { value: true, message: 'State name is required' } }}
            render={({ field: { onChange, value } }) => <Input placeholder="Type your State" label="State" onChangeText={onChange} value={value} error={errors.state?.message} />}
          />

          <View style={styles.saveBody}>
            <CheckBox
              defaultIsChecked={params?.isDefault === 'true'}
              boxActiveStyle={{ borderColor: color.active }}
              checkIcon={<CheckIcon color={color.active} size={18} />}
              onChange={(value) => {
                setValue('isDefault', value as boolean);
              }}
            />
            <Text>Save Default</Text>
          </View>
        </View>
        <View style={styles.contact}>
          <Text style={styles.title}>Save Address As</Text>
          <View style={styles.saveBody}>
            <AnimatedButton
              disabled={isUpdate}
              style={[styles.btn, animatedHomeStyle, { opacity: isUpdate ? 0.5 : 1 }]}
              onPress={() => {
                colorValue.value = 0;
                setValue('type', 'home');
              }}
            >
              <Text> Home</Text>
            </AnimatedButton>
            <AnimatedButton
              disabled={isUpdate}
              style={[styles.btn, animatedOfficeStyle, { opacity: isUpdate ? 0.5 : 1 }]}
              onPress={() => {
                colorValue.value = 1;
                setValue('type', 'office');
              }}
            >
              <Text> Office</Text>
            </AnimatedButton>
          </View>
        </View>
        <Button
          text={isUpdate ? 'Update Address' : isCart ? 'Order Now' : 'Save Address'}
          containerStyle={{ marginTop: 10 }}
          onPress={handleSubmit(isUpdate ? handleFromSubmitUpdate : handleFromSubmit)}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  contact: {
    rowGap: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    borderBottomColor: rcp(color.dark, 20),
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    paddingTop: 10,
  },
  saveBody: {
    flexDirection: 'row',
    columnGap: 10,
  },
  btn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
});

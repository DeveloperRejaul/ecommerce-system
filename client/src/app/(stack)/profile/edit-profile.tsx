/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { color } from '@/src/core/constants/color';
import Input from '@/src/core/meter/components/Input';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import Button from '@/src/core/meter/components/Button';
import { IAuthData } from '@/src/core/db-operations/auth';
import { Utils } from '@/src/core/utils/utils';
import { useUpdateUserMutation } from '@/src/core/rtk/user-api';
import gstyle from '@/gstyle';
import AvatarImagePacker from '@/src/core/components/AvatarImagePacker';

export default function EditProfile() {
  // @ts-ignore
  const user = useLocalSearchParams<IAuthData>();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [files, setFiles] = useState<ImagePicker.ImagePickerResult | null>(null);
  const { control, handleSubmit } = useForm({ defaultValues: { name: user.name, phone: user.phone, address: user.address?.trim() } });

  const handleUpdateUserData = async ({ name, phone, address }: Pick<IAuthData, 'address' | 'phone' | 'name'>) => {
    let url: null | string = null;
    try {
      // if change user avatar we just upload this image and get url
      if (Platform.OS === 'web') {
        if (files instanceof File) {
          const imgRes = await Utils.uploadFile(files, user.token);
          if (imgRes) url = imgRes;
        }
      } else if (files?.assets?.[0]) {
        const imgRes = await Utils.uploadFile(files.assets[0], user.token);
        if (imgRes) url = imgRes;
      }

      const data: Partial<IAuthData> = {
        userId: user.userId,
        name,
        phone,
        address,
      };
      if (url) data.avatar = url;
      updateUser(Utils.clearEmptyObject(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        text="Edit Profile"
        iconLeft={Platform.OS === 'web' ? <View /> : <ArrowRight style={{ transform: [{ rotate: '180deg' }], marginRight: 10 }} />}
      />
      <View style={gstyle.divider} />

      <View style={styles.container} className="container">
        <View style={styles.inputBody}>
          <View style={styles.avatarBody}>
            <AvatarImagePacker
              src={user?.avatar}
              onChange={setFiles}
            />
            <View>
              <Text style={styles.heading}>{user.name}</Text>
              <Text style={styles.id}>{user.email}</Text>
            </View>
          </View>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                label="Name"
                placeholder="John Doe"
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                label="Phone"
                placeholder="01000-00000"
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                label="Address"
                placeholder="Dhaka, Bangladesh"
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
            )}
          />
        </View>
        <Button
          text="Save"
          onPress={handleSubmit(handleUpdateUserData)}
          isDisabled={isLoading}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    color: color.dark,
  },
  id: {
    color: rcp(color.dark, 50),
    textAlign: 'center',
  },
  avatarBody: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  inputBody: {
    rowGap: 10,
  },
});

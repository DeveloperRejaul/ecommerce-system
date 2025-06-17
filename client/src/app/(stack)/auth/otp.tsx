/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/no-unescaped-entities */
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { router, useLocalSearchParams } from 'expo-router';
import Input from '@/src/core/meter/components/Input';
import Button from '@/src/core/meter/components/Button';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { ArrowLeft } from '@/src/core/assets/icons/arrow-left';
import CountDown from '@/src/core/meter/components/count-down';
import { useVerifyEmailMutation, useVerifyOtpMutation } from '@/src/core/rtk/user-api';

interface IOtp {
    otp1: string;
    otp2: string;
    otp3: string;
    otp4: string;
}

export default function Otp() {
  const params = useLocalSearchParams();
  const [isResend, setIsResend] = useState(false);
  const [action, setAction] = useState<'resend' | null >(null);
  const [resendEmail, { isLoading, data: emailVerifyData }] = useVerifyEmailMutation();
  const [verifyOtp, { isLoading: otpLoading }] = useVerifyOtpMutation();
  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: {
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
  } });

  const otp1Ref = useRef<TextInput>(null);
  const otp2Ref = useRef<TextInput>(null);
  const otp3Ref = useRef<TextInput>(null);
  const otp4Ref = useRef<TextInput>(null);

  const handleVerify = (data:IOtp) => {
    const otp = Object.values(data).join('');
    verifyOtp({ otp, token: action === 'resend' ? emailVerifyData?.token || '' : params.token as string });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.back()}
      >
        <ArrowLeft />
      </TouchableOpacity>
      <View style={styles.body}>
        <View style={styles.messageBody}>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subTitle}>Enter your verification code fro verify your mail</Text>
        </View>
        <CountDown onEnd={() => setIsResend(true)} action={action} />
        <View style={styles.otpBody}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={otp1Ref}
                placeholder="0"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  if (otp2Ref.current?.focus) {
                    if (text.length > 0) otp2Ref.current?.focus();
                  }
                }}
                value={value}
                error={errors.otp1?.message}
                containerStyle={{ width: 50, padding: 0 }}
                style={{ padding: 0, textAlign: 'center' }}
                maxLength={1}
                keyboardType="number-pad"
              />
            )}
            name="otp1"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={otp2Ref}
                placeholder="0"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  if (otp2Ref.current?.focus) {
                    text.length > 0 ? otp3Ref.current?.focus() : otp1Ref.current?.focus();
                  }
                }}
                value={value}
                error={errors.otp1?.message}
                containerStyle={{ width: 50, padding: 0 }}
                style={{ padding: 0, textAlign: 'center' }}
                maxLength={1}
                keyboardType="number-pad"
              />
            )}
            name="otp2"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={otp3Ref}
                placeholder="0"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  if (otp2Ref.current?.focus) {
                    text.length > 0 ? otp4Ref.current?.focus() : otp2Ref.current?.focus();
                  }
                }}
                value={value}
                error={errors.otp1?.message}
                containerStyle={{ width: 50, padding: 0 }}
                style={{ padding: 0, textAlign: 'center' }}
                maxLength={1}
                keyboardType="number-pad"
              />
            )}
            name="otp3"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={otp4Ref}
                placeholder="0"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  if (otp2Ref.current?.focus) {
                    if (text.length === 0) otp3Ref.current?.focus();
                  }
                }}
                value={value}
                containerStyle={{ width: 50, padding: 0 }}
                style={{ padding: 0, textAlign: 'center' }}
                maxLength={1}
                keyboardType="number-pad"
              />
            )}
            name="otp4"
          />
        </View>
        <Button
          isLoading={otpLoading}
          isDisabled={otpLoading}
          onPress={handleSubmit(handleVerify)}
          text="Verify"
          containerStyle={{ width: '100%' }}
        />
        <View style={styles.resendBody}>
          <Text style={styles.message}>
            Don't receive code?
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsResend(false);
              setAction('resend');
              resendEmail({ isResend: true, email: params.email as string });
            }}
            disabled={!isResend || isLoading}
            style={{ opacity: !isResend ? 0.5 : 1 }}
          >
            <Text style={styles.resend}>Resend</Text>
          </TouchableOpacity>
        </View>
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
  subTitle: {
    fontSize: 15,
    marginBottom: 20,
    color: rcp(color.dark, 80),
  },
  btn: {
    backgroundColor: rcp(color.active, 5),
    width: 50,
    height: 40,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  otpBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 30,
  },
  resend: {
    color: color.active,
    fontSize: 14,
  },
  message: {
    color: color.dark,
    fontSize: 14,
  },
  resendBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '99%',
  },
  body: {
    rowGap: 20,
  },
  messageBody: {
    paddingVertical: 50,
  },
});

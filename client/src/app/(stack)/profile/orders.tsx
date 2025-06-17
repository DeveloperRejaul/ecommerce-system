/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { Image, /* Pressable, */ ScrollView, StyleSheet, Text, View, ActivityIndicator, Platform } from 'react-native';
import React from 'react';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { color } from '@/src/core/constants/color';
// import { FilterIcon } from '@/src/core/assets/icons/filter';
import { randomId } from '@/src/core/meter/utils/random';
import Button from '@/src/core/meter/components/Button';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { useGetOrdersQuery } from '@/src/core/rtk/user-api';
import { colors } from '@/src/core/constants/constants';
import Error from '@/src/core/components/Error';
import Empty from '@/src/core/components/Empty';
import gstyle from '@/gstyle';
import { router } from 'expo-router';

export default function Orders() {
  const { isLoading, isError, isFetching, data: orders } = useGetOrdersQuery(undefined);

  return (
    <View>
      <Header
        text="Orders"
        iconLeft={Platform.OS === 'web' ? <View /> : <ArrowRight style={{ transform: [{ rotate: '180deg' }], marginRight: 10 }} />}
      />
      <View style={gstyle.divider} />
      {/* Container Body */}
      <ScrollView
        contentContainerStyle={styles.container}
        contentContainerClassName="container"
      >
        {isLoading || isFetching ? <ActivityIndicator size={25} /> : isError ? <Error /> : (orders?.length || 0) <= 0 ? <Empty /> : orders?.map((ele) => (
          <View key={randomId()} style={styles.cardBody}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.id}>
                  #
                  {ele.id}
                </Text>
                <Text style={styles.heading}>{ele.products[0]?.name}</Text>
              </View>
              <Image source={{ uri: `${ele.products[0]?.images[0]}` }} style={{ height: 50, width: 50 }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.mute} numberOfLines={2}>
                {ele.products[0]?.title}
              </Text>
              <Text style={styles.heading}>
                {ele?.price}
                ৳
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 15 }}>
              <Button
                text={ele?.status}
                variant="outline"
                textStyle={{ color: colors[ele?.status] }}
                containerStyle={{ borderColor: colors[ele?.status] }}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <View className='container'>
        <Button
          variant="outline"
          text="Back to home"
          textStyle={{ color: color.dark }}
          onPress={() => router.replace('/(tab)/')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
    paddingTop: 15,
    paddingBottom: 100,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
    borderRadius: 1000,
  },
  cardBody: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomColor: rcp(color.dark, 50),
    borderBottomWidth: 0.5,
    rowGap: 5,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  mute: {
    color: rcp(color.dark, 70),
  },
  id: {
    color: color.primary,
  },
});

/* eslint-disable no-nested-ternary */
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { color } from '@/src/core/constants/color';
import { randomId } from '@/src/core/meter/utils/random';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { useGetCouponsQuery } from '@/src/core/rtk/user-api';
import Error from '@/src/core/components/Error';
import Empty from '@/src/core/components/Empty';
import gstyle from '@/gstyle';

export default function Coupons() {
  const { data = [], isLoading, isFetching, isError } = useGetCouponsQuery(null);

  return (
    <>
      <Header
        text="My Coupons"
        iconLeft={Platform.OS === 'web' ? <View /> : <ArrowRight style={{ transform: [{ rotate: '180deg' }], marginRight: 10 }} />}
      />
      <View style={gstyle.divider} />
      <ScrollView
        contentContainerStyle={styles.container}
        contentContainerClassName="container"
      >
        {isLoading || isFetching ? <ActivityIndicator size={25} /> : isError ? <Error /> : data?.length <= 0 ? <Empty /> : data?.map((ele) => {
          // handle start date
          const startDate = new Date(ele.time.from);
          const startDay = startDate.getDay().toString().padStart(2, '0');
          const startMonth = startDate.getMonth().toString().padStart(2, '0');
          const startYear = startDate.getFullYear();
          // handle end date
          const endDate = new Date(ele.time.to);
          const endDay = endDate.getDay().toString().padStart(2, '0');
          const endMonth = endDate.getMonth().toString().padStart(2, '0');
          const endYear = endDate.getFullYear();

          return (
            <View key={randomId()} style={styles.body}>
              <View style={styles.left}>
                <Text style={styles.heading}>
                  {ele.value}
                  {ele.type === 'FIX' ? 'tk' : '%'}
                </Text>
                <Text style={styles.mute}>Off</Text>
              </View>
              <View>
                <Text style={styles.mute}>{ele.name}</Text>
                <Text style={[styles.heading, { fontWeight: '500' }]}>
                  {`${startDay}:${startMonth}:${startYear}`}
                  {' '}
                  to
                  {' '}
                  {`${endDay}:${endMonth}: ${endYear}`}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    rowGap: 15,
  },
  body: {
    flexDirection: 'row',
    backgroundColor: rcp(color.active, 7),
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: rcp(color.dark, 20),
  },
  left: {
    width: '20%',
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mute: {
    color: rcp(color.dark, 70),
    fontSize: 16,
  },
});

import { View, useWindowDimensions, StyleSheet, ScrollView, Platform } from 'react-native';
import React from 'react';
import Header from '@/src/core/components/header';
import RoundedCategory from '@/src/core/components/rounded-category';
import SquareCategory from '@/src/core/components/square-category';
import { useGetCategoryQuery } from '@/src/core/rtk/category-api';
import { randomId } from '@/src/core/meter/utils/random';
import Divider from '@/src/core/components/Divider';

export default function Category() {
  const { height } = useWindowDimensions();
  const { isLoading, data: category = [] } = useGetCategoryQuery(undefined);

  return (
    <View className="flex-1">
      <Header text="Category" />
      <Divider />
      <View className="container pt-5">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ maxHeight: Platform.select({ web: height }) }}
        >
          <View style={styles.conPh}>
            {/* Category part */}
            <View className="flex-row flex-wrap gap-x-7 gap-y-5 px-10 md:px-0">
              {category.filter((data) => data.type === 'ROUNDED').map((cat) => (<RoundedCategory {...{ ...cat, isLoading }} key={randomId()} />))}
            </View>

            {/* Spacial category */}
            {category.filter((data) => data.type === 'SQUARE').map((sCat, index) => (<SquareCategory {...{ ...sCat, index, isLoading }} key={randomId()} />))}
          </View>
        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  conPh: {
    paddingHorizontal: 10,
    rowGap: 10,
    paddingBottom: Platform.select({ web: 200, ios: 100, android: 100 }),
  },
});

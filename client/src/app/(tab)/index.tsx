import {
  FlatList, Image, Platform, Pressable,
  ScrollView, StyleSheet, Text, useWindowDimensions, View,
  RefreshControl,
} from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import Header from '@/src/core/components/header';
import { color } from '@/src/core/constants/color';
import { MoreIcon } from '@/src/core/assets/icons/more';
import CardCarousal from '@/src/core/meter/components/Carousal';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import SquareCard from '@/src/core/components/square-card';
import RoundedCategory from '@/src/core/components/rounded-category';
import { randomId } from '@/src/core/meter/utils/random';
import { useGetCategoryQuery } from '@/src/core/rtk/category-api';
import type { IProductRenderItem, ICategoryTypes, IRoundedCategory } from '@/types';
import { useGetProductByCategoryIdQuery } from '@/src/core/rtk/product-api';
import { CategoryType } from '@/src/core/constants/constants';
import { useGetShopQuery } from '@/src/core/rtk/shop-api';
import SquareCardSkeleton from '@/src/core/components/skeleton/squareCardSkeleton';

export default function Index() {
  const { height, width } = useWindowDimensions();
  const PADDING_HORIZONTAL = 20;
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading, data: shop, isError, refetch } = useGetShopQuery(undefined);
  const { isLoading: categoryLoading, data: category = [], refetch: refetchCategory } = useGetCategoryQuery(undefined);
  const trendyCategory = category.find((cat) => cat.name === 'Trendy');
  const popularCategory = category.find((cat) => cat.name === 'Popular');
  const { data: trendyProducts, refetch: refetchTrendyCategory, isLoading: isLoadingTrendyProducts } = useGetProductByCategoryIdQuery({ id: trendyCategory?.id }, { skip: !trendyCategory });
  const { data: popularProducts, refetch: refetchPopularCategory, isLoading: isLoadingPopularProducts } = useGetProductByCategoryIdQuery({ id: popularCategory?.id }, { skip: !popularCategory });
  const topSelection = category.filter((item) => item.type === CategoryType.TOP_SELECTION);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    refetchCategory();
    refetchTrendyCategory();
    refetchPopularCategory();
    setRefreshing(false);
  };

  const roundedCategory = categoryLoading ? Array.from({ length: 8 }) : (category.filter((d) => d.type === 'ROUNDED') || []);
  return (
    <View className="container">
      <Header
        text={Platform.OS === 'web' ? '' : 'Home'}
        onCard={() => router.navigate('/(stack)/cart')}
        onSearch={() => router.navigate('/(stack)/search')}
        onWishlist={() => router.navigate('/(tab)/wishlist')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[style.con, { maxHeight: Platform.select({ web: (height - 100) }) }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Carousal part */}
        <View style={[style.conPh]}>
          <CardCarousal
            dotActiveColor={color.weight}
            dotInactiveColor={rcp(color.weight, 50)}
            data={shop?.banner || []}
            isLoading={isLoading}
            isError={isError}
            imageStyle={{ width: Platform.select({ android: width - PADDING_HORIZONTAL, ios: width - PADDING_HORIZONTAL, web: width < 788 ? width : null }) }}
          />
        </View>
        {/* Category Part */}

        <View style={style.conPh} className="flex-row flex-wrap gap-x-7 gap-y-5 px-10 md:px-0">
          {roundedCategory.slice(0, 7).map((cat) => (
            <RoundedCategory {...{ ...((cat || {}) as IRoundedCategory), isLoading: categoryLoading }} key={randomId()} />
          ))}
          {roundedCategory.length > 7 && (
          <RoundedCategory isLoading={categoryLoading} text="More" icon={<MoreIcon color={color.active} />} />
          )}
        </View>
        {/* Popular Items */}
        <View style={style.conPh}>
          <View style={style.listHeader}>
            <Text style={style.cardTitle}>Most Popular</Text>
            {viewAll('popular', popularCategory?.id || '')}
          </View>
          {categoryLoading || isLoadingPopularProducts ? (
            <View className="flex-row justify-between">
              <SquareCardSkeleton />
              <SquareCardSkeleton />
            </View>
          )
            : (
              <FlatList
                horizontal
                data={popularProducts?.data || []}
                renderItem={popularRenderItem}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={itemSeparator}
              />
            )}
        </View>
        {/* Trendy collection */}
        <View style={style.conPh}>
          <View style={style.listHeader}>
            <Text style={style.cardTitle}> Trendy collection</Text>
            {viewAll('trendy', trendyCategory?.id || '')}
          </View>
          {categoryLoading || isLoadingTrendyProducts ? (
            <View className="flex-row justify-between">
              <SquareCardSkeleton />
              <SquareCardSkeleton />
            </View>
          )
            : (
              <FlatList
                horizontal
                data={trendyProducts?.data || []}
                renderItem={trendyRenderItem}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={itemSeparator}
              />
            )}
        </View>
        {/* Top Selection */}
        <View style={[style.topSelection, style.conPh]}>
          <Text style={[style.cardTitle, { color: color.weight, paddingBottom: 10 }]}>Top Selection </Text>
          <View style={style.topItem}>
            {topSelection.map((top) => <TopSelectProduct key={top.name} {...top} />) }
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * A component to render a top selection product card.
 *
 * @param props - The props for the component.
 * @param props.props.id - The unique identifier of the product.
 * @param props.props.name - The name of the product.
 * @param props.props.avatar - The URI of the product's avatar image.
 * @param props.props.discount - The discount percentage on the product.
 * @param props.props.width - The width of the card.
 *
 * @returns - A React component for rendering a top selection product card.
 */
function TopSelectProduct(props: ICategoryTypes) {
  return (
    <Pressable
      className="w-[48%] h-[200px] md:h-[250px] lg:h-[300px]"
      onPress={() => router.push({ pathname: '/product', params: { filter: props.name, id: props.id } })}
      style={style.topSelectionCard}
    >
      <Image
        source={{ uri: props.avatar }}
        style={style.img}
      />
      <View style={style.textBody}>
        <Text style={style.title}>{props.name}</Text>
        <Text style={style.text}>
          {`Upto ${props.discount}% off`}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * A function to render a "View All" button with navigation to the product list page.
 *
 * @param name - The name of the product filter ('trendy' or 'popular').
 *
 * @returns - A React component for the "View All" button.
 */
function viewAll(name: 'trendy' | 'popular', id: string) {
  return (
    <Pressable
      onPress={() => router.navigate({ pathname: '/(stack)/product/', params: { filter: name, id } })}
      style={style.viewAll}
    >
      <Text style={style.viewBtn}>
        View all
      </Text>
      <ArrowRight size={25} color={rcp(color.dark, 50)} />
    </Pressable>
  );
}

const itemSeparator = () => <View style={{ width: 10 }} />;

const popularRenderItem = ({ item }:IProductRenderItem) => (
  <SquareCard
    onPress={() => {
      router.push({
        pathname: '/(stack)/product/[id]',
        params: { id: item.id, category: 'Popular' },
      });
    }}
    id={item.id}
    img={item.images[0]}
    name={item.name}
    rating={item.rating}
    title={item.title}
    price={item.sellPrice}
    discount={item.discount}
    description={item.description}
  />
);

const trendyRenderItem = ({ item }:IProductRenderItem) => (
  <SquareCard
    onPress={() => {
      router.push({
        pathname: '/(stack)/product/[id]',
        params: { id: item.id, category: 'Trendy' },
      });
    }}
    id={item.id}
    img={item.images[0]}
    name={item.name}
    title={item.title}
    rating={item.rating}
    price={item.sellPrice}
    discount={item.discount}
    description={item.description}
  />
);

const style = StyleSheet.create({
  con: {
    rowGap: 10,
  },
  conPh: {
    paddingHorizontal: 10,
  },
  topSelectionCard: {
    backgroundColor: color.weight,
    borderRadius: 10,
    overflow: 'hidden',
  },
  topSelection: {
    backgroundColor: color.dark,
    paddingVertical: 10,
    paddingBottom: 110,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.primary,
  },
  viewBtn: {
    fontSize: 18,
    color: color.inactive,
  },
  categoryBoxBody: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    padding: 2,
  },
  carousal: {
    width: '100%',
    height: 170,
    backgroundColor: 'red',
    borderRadius: 7,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10 },
  img: {
    width: '100%',
    height: '75%',
  },
  textBody: {
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  title: {
    fontWeight: 'bold',
    color: color.dark,
    fontSize: 14,
  },
  text: {
    color: rcp(color.dark, 50),
    fontSize: 13,
  },
  topItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  viewAll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

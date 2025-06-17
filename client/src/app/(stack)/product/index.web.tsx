/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { SortIcon } from '@/src/core/assets/icons/sort';
import type { SortByBottomSheetItemPressParams } from '@/types';
import SquareCard from '@/src/core/components/square-card';
import { bottomSheet } from '@/src/core/meter/components/BottomSheet';
import { BrandBottomSheet, DiscountBottomSheet, SortByBottomSheet } from '@/src/core/components/bottom-sheet/filter-bottom-sheet';
import { useGetProductByCategoryIdQuery, useLazyGetProductByCategoryIdPageQuery } from '@/src/core/rtk/product-api';
import { Utils } from '@/src/core/utils/utils';
import Error from '@/src/core/components/Error';
import Empty from '@/src/core/components/Empty';
import Loading from '@/src/core/components/Loading';

let page = 0;
const queryParams:{[key:string]:string} = {};
export default function Index() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const params = useLocalSearchParams<{filter: string, id:string}>();
  const [getProduct, res] = useLazyGetProductByCategoryIdPageQuery();
  const { data: products, isFetching, isLoading, isError } = useGetProductByCategoryIdQuery({ id: params.id });
  const filter = [
    { right: ArrowRight, text: 'Sort By', left: SortIcon },
    // { right: ArrowLeft, text: 'Filter', left: FilterIcon },
    { right: ArrowRight, text: 'Brand', left: null },
    // { right: ArrowLeft, text: 'Discount', left: null },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMore = () => {
    if (isFetching || isLoading || res.isFetching) return;
    page += 1;

    if (page < (products?.total_page || 0)) {
      getProduct({ id: params.id, page, ...queryParams });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      // Check if user reached near the bottom
      if (scrollTop + clientHeight >= scrollHeight - 100 && !res.isLoading) {
        handleMore();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleMore, res.isLoading]);

  const handleFilter = (name:'Sort By' | 'Filter'|'Brand'|'Discount'| string) => {
    switch (name) {
      case 'Sort By':
        bottomSheet.show({ render: <SortByBottomSheet onPress={handleSortby} /> });
        break;
      case 'Brand':
        bottomSheet.show({ render: <BrandBottomSheet onChange={handleBrandChange} /> });
        break;
      case 'Discount':
        bottomSheet.show({ render: <DiscountBottomSheet onChange={handleDiscountChange} /> });
        break;
      case 'Filter':
        router.push('/(stack)/product/filter');
        break;

      default:
        break;
    }
  };

  const handleSortby = (value: SortByBottomSheetItemPressParams) => {
    switch (value) {
      case "What's new":
        getProduct({ id: params.id, page: 0, sortField: 'createdAt', sortOrder: 'DESC' });
        queryParams.sortField = 'createdAt';
        queryParams.sortOrder = 'DESC';
        page = 0;
        break;
      case 'Price - high to low':
        getProduct({ id: params.id, page: 0, sortField: 'sellPrice', sortOrder: 'DESC' });
        queryParams.sortField = 'sellPrice';
        queryParams.sortOrder = 'DESC';
        page = 0;
        break;
      case 'Price - low to high':
        getProduct({ id: params.id, page: 0, sortField: 'sellPrice', sortOrder: 'ASC' });
        queryParams.sortField = 'sellPrice';
        queryParams.sortOrder = 'ASC';
        page = 0;
        break;

      case 'Popularity':
        getProduct({ id: params.id, page: 0, sortField: 'rating', sortOrder: 'DESC' });
        queryParams.sortField = 'rating';
        queryParams.sortOrder = 'DESC';
        page = 0;
        break;
      case 'Discount':
        getProduct({ id: params.id, page: 0, sortField: 'discount', sortOrder: 'DESC' });
        queryParams.sortField = 'discount';
        queryParams.sortOrder = 'DESC';
        page = 0;
        break;
      default:
        break;
    }
  };

  const handleBrandChange = (brands:string[]) => {
    getProduct({ id: params.id, page: 0, brands: brands.join(',') });
    page = 0;
    queryParams.brands = brands.join(',');
  };

  const handleDiscountChange = (values:number[]) => {
    getProduct({ id: params.id, page: 0, discounts: values.join(',') });
    queryParams.discounts = values.join(',');
    page = 0;
  };

  return (
    <View>
      {/* Header  */}
      <Header text={Utils.fastLatterUpperCase(params.filter)} />
      <View style={styles.divider} />

      {/* Filter Button  */}
      <View style={styles.btnContainer} className="container">
        {filter.map((ele) => (
          <Pressable style={styles.btn} key={ele.text} onPress={() => handleFilter(ele.text)}>
            {ele.left && <ele.left size={20} color={color.active} />}
            <Text style={{ color: color.dark }}>{ele.text}</Text>
            <ele.right size={20} color={color.active} style={{ transform: [{ rotate: '90deg' }] }} />
          </Pressable>
        ))}
      </View>
      <div className="h-[95vh] overflow-y-auto scrollbar-hide container">
        <div
          ref={containerRef}
          className="flex flex-wrap gap-4 pt-4 pb-10"
        >
          {isLoading ? <Loading /> : isError ? <Error /> : (products?.data.length || 0) > 0 ? (products?.data || []).map((item) => (

            <SquareCard
              onPress={() => {
                router.push({
                  pathname: '/(stack)/product/[id]',
                  params: { id: item.id, category: params.filter },
                });
              }}
              id={item?.id}
              img={item?.images[0]}
              name={item?.name}
              rating={item?.rating}
              title={item?.title}
              price={item?.sellPrice}
              discount={item?.discount}
              description={item?.description}
            />
          )) : <Empty />}
        </div>
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { transform: [{ rotate: '180deg' }], marginRight: 10 },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: rcp(color.dark, 15),
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
    backgroundColor: rcp(color.active, 10),
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: rcp(color.dark, 10),
  },
  btnContainer: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    columnGap: 10,
  },
});

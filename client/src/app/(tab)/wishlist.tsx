import { View, StyleSheet, useWindowDimensions, Platform, FlatList, ActivityIndicator } from 'react-native';
import React from 'react';
import Header from '@/src/core/components/header';
import Card from '@/src/core/components/vertical-card';
import { withAuth } from '@/src/core/components/HOC/withAuth';
import { useGetWishlistQuery, useLazyGetWishListPageQuery, useRemoveWishlistMutation } from '@/src/core/rtk/user-api';
import Divider from '@/src/core/components/Divider';
import Empty from '@/src/core/components/Empty';

let page = 0;
function Wishlist() {
  const { height } = useWindowDimensions();
  const { isLoading, isFetching, data } = useGetWishlistQuery(null);
  const [getWishList, res] = useLazyGetWishListPageQuery();
  const [removeWishlist] = useRemoveWishlistMutation();
  const products = data?.data || [];

  const handleMore = () => {
    if (isFetching || res.isFetching) return;
    page += 1;
    if (page < (data?.total_page || 0)) {
      getWishList({ page, limit: 10 });
    }
  };

  return (
    <View>
      <Header text="Wishlist" />
      <Divider style={{ marginBottom: 20 }} />
      {(isLoading || isFetching) ? <ActivityIndicator /> : products.length < 1 ? <Empty text="You have no favorite product" /> : (
        <FlatList
          contentContainerClassName="container"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ maxHeight: Platform.select({ web: height }), ...styles.container }}
          data={products}
          keyExtractor={(item) => item.id}
          onEndReached={handleMore}
          renderItem={({ item, index }) => (
            <Card
              key={index}
              img={item.product?.images[1] || ''}
              discount={item.product?.discount}
              id={item.product?.id}
              name={item.product?.name}
              price={item.product?.sellPrice}
              rating={item.product?.rating}
              title={item.product?.title}
              isFavorite
              onRemoveFavorite={() => removeWishlist({ id: item.id })}
            />
          )}
          ListFooterComponent={ListFooterComponent(isFetching || res.isFetching || isLoading || res.isLoading)}
        />
      )}
    </View>
  );
}

export default withAuth(Wishlist);

const ListFooterComponent = (isMoreReq: boolean) => function Com() {
  if (isMoreReq) {
    return <ActivityIndicator size={15} />;
  }
  return null;
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    rowGap: 10,
    paddingBottom: Platform.select({ android: 100, ios: 100, web: 200 }),
  },
});

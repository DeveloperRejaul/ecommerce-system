/* eslint-disable react-hooks/exhaustive-deps */
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { interpolate, interpolateColor, useAnimatedProps, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import CardCarousal from '@/src/core/meter/components/Carousal';
import { color } from '@/src/core/constants/color';
import { WishlistIcon } from '@/src/core/assets/icons/wishlist';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { RatingIcon } from '@/src/core/assets/icons/rating';
import Button from '@/src/core/meter/components/Button';
import { Radio, RadioGroup } from '@/src/core/meter/components/Radio';
import { useGetProductByIdQuery } from '@/src/core/rtk/product-api';
import { Utils } from '@/src/core/utils/utils';
import { addCard } from '@/src/core/db-operations/card';
import { getAuthUser } from '@/src/core/db-operations/auth';
import { animatedAlert } from '@/src/core/components/AnimatedAlert';
import { useCreateWishlistMutation, useLazyGetWishlistByProductIdQuery, useRemoveWishlistMutation } from '@/src/core/rtk/user-api';
import { Wishlist2Icon } from '@/src/core/assets/icons/wishlist2';
import Loading from '@/src/core/components/Loading';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function ProductDetails() {
  const { id, category } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  const { back } = useRouter();
  const router = useRouter();
  const CHAR_SIZE = 10;
  const PADDING = 10;
  const CATEGORY_WIDTH = (CHAR_SIZE * category.length) + PADDING * 2;
  const HEADER_HEIGHT = 80;
  const offsetY = useSharedValue(0);
  // handle api call
  const { data: product, isError, isLoading, isSuccess: isProductSuccess } = useGetProductByIdQuery({ id });
  const [getWishlistByProductId, { isSuccess, data: wishlist }] = useLazyGetWishlistByProductIdQuery();
  const [createWishlist] = useCreateWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();
  const [isFavorite, setIsFavorite] = useState(isSuccess);

  useEffect(() => {
    if (product && isProductSuccess) {
      getWishlistByProductId({ id: product.id });
    }
  }, [product, isProductSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setIsFavorite(isSuccess);
    } else {
      setIsFavorite(false);
    }
  }, [isSuccess]);

  const handleWishlist = async () => {
    const user = await getAuthUser();
    if (!user) {
      animatedAlert.show({ message: 'Please login' });
      return;
    }
    const userId = user?.userId || '';
    const productId = product?.id || '';
    if (isFavorite) {
      removeWishlist({ id: wishlist.id });
      setIsFavorite(false);
      return;
    }
    createWishlist({ userId, productId, product });
    setIsFavorite(true);
  };

  // handle scroll animation
  const handleScroll = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(offsetY.value, [0, HEADER_HEIGHT], ['#00000000', '#ffffff']),
    elevation: interpolate(offsetY.value, [0, HEADER_HEIGHT], [0, 2]),
  }));

  const animatedIconProps = useAnimatedProps(() => ({
    stroke: interpolateColor(offsetY.value, [0, HEADER_HEIGHT], ['#ffffff', '#000000']),
  }));

  // format api response data
  const carousalData = (product?.images || []).map((d, i) => ({ imgUrl: d, id: i.toString().padStart(2, '0') }));
  const specifications = Utils.parseSpecification(product?.specification || '');

  // find colors and sizes
  const { colors = '' } = specifications;
  const { sizes = '' } = specifications;
  const colorsArray = colors.split(',');
  const sizesArray = sizes.split(',');

  return (
    <View className="container">
      {/* Header part */}
      <Animated.View style={[styles.header, animatedStyle, {
        height: HEADER_HEIGHT,
        alignItems: 'flex-end',
        paddingBottom: 10,
      }]}
      >
        {Platform.OS !== 'web' ? (
          <Pressable onPress={() => back()}>
            <Svg
              width={35}
              height={35}
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              fill="none"
              style={{ transform: [{ rotate: '180deg' }] }}
            >
              <AnimatedPath
                d="M9 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                animatedProps={animatedIconProps}
              />
            </Svg>
          </Pressable>
        ) : <View />}
        <Pressable onPress={handleWishlist}>
          {isFavorite ? (
            <Wishlist2Icon
              size={30}
              color={color.weight}
            />
          ) : (
            <WishlistIcon
              size={30}
              color={color.weight}
            />
          )}
        </Pressable>
      </Animated.View>
      {/* Image slide part */}
      {isLoading ? <Loading /> : (
        <>
          <Animated.ScrollView
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
              maxHeight: Platform.select({ web: height }),
            }}
          >
            <View style={{ paddingBottom: Platform.select({ web: 100 }) }}>
              <CardCarousal
                isError={isError}
                isLoading={isLoading}
                height={300}
                containerStyle={{ borderRadius: 0 }}
                dotStyle={styles.dot}
                dotActiveStyle={{ backgroundColor: color.weight }}
                loop
                data={carousalData}
              />
              <View style={styles.container}>
                <Text style={[styles.category, { width: CATEGORY_WIDTH, paddingVertical: (PADDING - 5) }]}>
                  {category}
                </Text>
                <Text style={styles.name}>{product?.name || ''}</Text>
                <Text style={styles.title}>{product?.title || ''}</Text>
                <View style={styles.rattingContainer}>
                  <View style={styles.rattingBody}>
                    <RatingIcon size={20} />
                    <Text style={styles.name}>{product?.rating || 4.99}</Text>
                    <Text style={styles.review}>(2.6k review)</Text>
                  </View>
                  {/* colors  */}
                  {colorsArray.length > 1 && (
                  <RadioGroup
                    defaultActive={colorsArray[0]}
                    onChange={(value) => { console.log(value); }}
                  >
                    {colorsArray.map((radio) => (
                      <Radio
                        key={Math.random()}
                        value={radio}
                        borderStyle={{ borderColor: 'transparent' }}
                        ballStyle={{ backgroundColor: radio }}
                        borderActiveStyle={{ borderColor: rcp(color.dark, 20) }}
                      />
                    ))}
                  </RadioGroup>
                  )}
                </View>
                {/* Size */}
                {sizesArray.length > 1 && (
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.key}>Size:</Text>
                  <RadioGroup
                    defaultActive={sizes[0]}
                    onChange={(value) => { console.log(value); }}
                  >
                    {sizesArray.map((radio) => (
                      <Radio
                        gap={0.7}
                        size={30}
                        key={Math.random()}
                        value={radio}
                        borderStyle={{ borderColor: 'transparent' }}
                        ballStyle={{ backgroundColor: rcp(color.dark, 20) }}
                        borderActiveStyle={{ borderColor: color.active, borderWidth: 2 }}
                        ballActiveStyle={{ backgroundColor: color.active }}
                        text={radio}
                      />
                    ))}
                  </RadioGroup>
                </View>
                )}
                <View style={styles.divider} />
                {/* Specifications Part */}
                <Text style={styles.name}>Specifications</Text>
                {Object.keys(specifications).map((key:string) => (
                  <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.key}>{key}</Text>
                    <Text style={styles.value}>{specifications[key]}</Text>
                  </View>
                ))}
                <View style={styles.divider} />
                {/* Description Part  */}
                <Text style={styles.name}>Description</Text>
                <Text style={styles.title}>
                  {product?.description || ''}
                </Text>
              </View>
            </View>
          </Animated.ScrollView>
          {/* Footer part  */}
          <View style={[styles.row, styles.btnContainer]}>
            <View style={[styles.row, { columnGap: 7 }]}>
              <View>
                <Text style={[styles.name, { fontSize: 20 }]}>
                  ৳
                  {product?.sellPrice}
                </Text>
                <Text style={styles.off}>
                  {Utils.getPresent((product?.discount || 0), (product?.sellPrice || 0))}
                  % OFF
                </Text>
              </View>
              <Text style={[styles.review, { textDecorationLine: 'line-through', marginTop: 7 }]}>
                ৳
                {(product?.sellPrice || 0) + (product?.discount || 0)}
              </Text>
            </View>
            <Button
              text="Add Cart"
              onPress={async () => {
                await addCard(id as string);
                router.navigate('/(stack)/cart');
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  category: {
    fontSize: 18,
    color: rcp(color.dark, 80),
    backgroundColor: rcp(color.active, 20),
    borderRadius: 10,
    textAlign: 'center',
  },
  container: { paddingHorizontal: 10, paddingTop: 10, rowGap: 7 },
  name: { fontWeight: 'bold', fontSize: 17 },
  title: {
    fontSize: 14,
    color: rcp(color.dark, 50),
    fontWeight: '400',
  },
  rattingBody: {
    flexDirection: 'row',
    columnGap: 6,
    alignItems: 'center',
  },
  review: {
    fontSize: 13,
    color: rcp(color.dark, 50),
  },
  rattingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: rcp(color.dark, 20),
    marginVertical: 10,
  },
  key: {
    fontSize: 14,
    fontWeight: '600',
    color: rcp(color.dark, 90),
  },
  value: {
    fontSize: 14,
    fontWeight: '400',
    color: rcp(color.dark, 70),
  },
  row: { flexDirection: 'row' },
  btnContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 60,
    backgroundColor: color.weight,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTopColor: rcp(color.dark, 20),
    borderTopWidth: 0.5,
  },
  off: {
    color: color.active,
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  dot: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: color.weight,
  },
});

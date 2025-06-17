/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { color } from '@/src/core/constants/color';
import { ScissorsIcon } from '@/src/core/assets/icons/scissors';
import Input from '@/src/core/meter/components/Input';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import Button from '@/src/core/meter/components/Button';
import { getCardId, removeCard } from '@/src/core/db-operations/card';
import { useLazyGetProductByIdQuery } from '@/src/core/rtk/product-api';
import { ICardProduct, IProduct } from '@/types';
import { animatedAlert } from '@/src/core/components/AnimatedAlert';
import { useApplyCouponMutation } from '@/src/core/rtk/user-api';
import { getAddresses } from '@/src/core/db-operations/address';
import { getAuthUser } from '@/src/core/db-operations/auth';
import { animatedToast } from '@/src/core/components/AnimatedToast';
import cardProductPriceCalculate from '@/src/core/utils/price';
import Divider from '@/src/core/components/Divider';

export default function Cart() {
  const router = useRouter();
  const { handleSubmit, control, setValue } = useForm({ defaultValues: { coupon: '' } });
  const { height } = useWindowDimensions();
  const [getProducts, { data, isLoading }] = useLazyGetProductByIdQuery();
  const [applyCoupon, { data: coupon }] = useApplyCouponMutation();
  const [products, setProducts] = useState<ICardProduct[]>([]);

  useEffect(() => {
    updateProductState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        setProducts((data as IProduct[])?.map((ele) => ({ ...ele, pis: 1 })));
        return;
      }
      setProducts([({ ...data, pis: 1 }) as ICardProduct]);
    }
  }, [data]);

  const updateProductState = async () => {
    const productIds = await getCardId();
    if (productIds && productIds?.length > 0) {
      const ids = productIds.map((product) => product.cardId);
      getProducts({ id: ids.join(',') });
      return;
    }
    setProducts([]);
  };

  const increment = (id:string) => setProducts((pre) => pre.map((item) => {
    if (item.id === id) return { ...item, pis: item.pis + 1 };
    return item;
  }));

  const decrement = (id:string) => setProducts((pre) => pre.map((item) => {
    if (item.id === id && item.pis > 0) return { ...item, pis: item.pis - 1 };
    return item;
  }));

  const handleDelete = (id:string) => {
    animatedAlert.show({ message: 'Are you sure? \nDelete this product from cart.' }, async (status) => {
      if (status === 'ok') {
        await removeCard(id);
        updateProductState();
      }
    });
  };

  // handle coupon
  const handleCoupon = (data:{coupon:string}) => {
    applyCoupon({ name: data.coupon, categoryId: products.map((pd) => pd.categoryId).join(','), productId: products.map((pd) => pd.id).join(',') });
  };

  // handle product price calculation
  const formattedProducts = products.map((pr) => ({ discount: pr.discount, quantity: pr.pis, sellPrice: pr.sellPrice }));
  const { finalPrice, tax, totalPrice, totalDiscount, deliveryFee, totalCouponDiscount } = cardProductPriceCalculate({ coupon, products: formattedProducts });
  const priceInfo:{[key:string]:string} = {
    Price: `৳${totalPrice}`,
    Tax: `${tax}%`,
    Discount: `-৳${totalDiscount}`,
    'Delivery Fee': `৳${deliveryFee}`,
    'Coupon Discount': `-৳${Math.floor(totalCouponDiscount)}`,
  };

  const params = JSON.stringify({ products, coupon, priceInfo: { ...priceInfo, totalPrice: finalPrice } });

  // handle final checkout button click
  const handleCheckout = async () => {
    // check address availability
    const address = await getAddresses();
    if (address.length <= 0) {
      router.navigate({ pathname: '/(stack)/profile/address', params: { from: 'CART', data: params } });
      return;
    }

    // check user authorization
    const user = await getAuthUser();
    if (!user) {
      animatedToast.show({ message: 'Please login for order', title: 'Login', bgColor: color.error });
      router.navigate({ pathname: '/(stack)/auth/', params: { from: 'CART', data: params } });
      return;
    }
    // if all exists we navigate to order
    router.navigate({ pathname: '/cart/order', params: { data: params } });
  };

  return (
    <View className="flex-1">
      <Header
        text="Cart"
        iconLeft={Platform.OS === 'web' ? <View /> : <ArrowRight size={30} style={{ transform: [{ rotate: '180deg' }] }} />}
      />
      <Divider />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} className="container">
        {isLoading ? <ActivityIndicator size={30} /> : products.length <= 0 ? <Text style={{ textAlign: 'center', paddingTop: 20 }}> You have no product in cart</Text> : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ maxHeight: Platform.select({ web: height }), paddingBottom: 100 }}
            >
              <View style={styles.container}>
                {/* Items Part start */}
                <View>
                  {products.map((cart) => (
                    <TouchableOpacity style={styles.cartBody} key={cart.id} onLongPress={() => handleDelete(cart.id)}>
                      {/* left */}
                      <View style={styles.imgBody}>
                        <Image style={styles.img} source={{ uri: cart.images[0] }} />
                      </View>
                      {/* Right */}
                      <View style={styles.info}>
                        <Text style={styles.price}>{cart.name}</Text>
                        <Text style={styles.title}>{cart.title}</Text>
                        <View style={styles.rightFooter}>
                          <View style={styles.priceBody}>
                            <Text style={styles.price}>
                              ৳
                              {cart.sellPrice}
                            </Text>
                            <Text style={styles.discount}>
                              ৳
                              {cart.sellPrice + cart.discount}
                            </Text>
                          </View>
                          <View style={styles.pisBody}>
                            <Text style={styles.btn} onPress={() => increment(cart.id)}>+</Text>
                            <Text style={styles.text}>{cart.pis}</Text>
                            <Text style={[styles.btn, styles.text]} onPress={() => decrement(cart.id)}>-</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Items Part ebd  */}
                <View style={styles.calculation}>
                  <Text style={styles.title}>Have a coupon code ? enter here</Text>
                  <Controller
                    control={control}
                    name="coupon"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        value={value}
                        onChangeText={onChange}
                        placeholder="Enter Your Offer Code"
                        inActiveBorderColor={color.active}
                        leftIcon={(
                          <TouchableOpacity onPress={() => setValue('coupon', '')}>
                            <ScissorsIcon color={color.active} />
                          </TouchableOpacity>
                      )}
                        rightIcon={(
                          <TouchableOpacity onPress={handleSubmit(handleCoupon)}>
                            <ArrowRight color={color.active} />
                          </TouchableOpacity>
                      )}
                        containerStyle={{ borderStyle: 'dashed' }}
                      />
                    )}
                  />
                  {Object.keys(priceInfo).map((key) => (
                    <View style={styles.body} key={key}>
                      <Text style={styles.key}>
                        {key}
                        :
                      </Text>
                      <Text style={styles.value}>
                        {priceInfo[key]}
                      </Text>
                    </View>
                  )) }
                  <View style={styles.divider} />
                  <View style={styles.body}>
                    <Text style={styles.key}> Total :</Text>
                    <Text style={{ ...styles.price, fontSize: 20 }}>
                      ৳
                      {finalPrice}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            {/* Footer part  */}
            <View style={[styles.row, styles.btnContainer]}>
              <View style={[{ columnGap: 7 }]}>
                <Text style={{ ...styles.price, fontSize: 20, color: color.primary }}>
                  ৳
                  {finalPrice}
                </Text>
                <Text style={styles.title}>View price details</Text>
              </View>
              <Button
                text="Checkout"
                onPress={handleCheckout}
              />
            </View>
          </>
        ) }
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  cartBody: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: rcp(color.dark, 20),
    columnGap: 10,
    paddingHorizontal: 10,
  },
  imgBody: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  img: {
    height: 100,
    width: 80,
    resizeMode: 'cover',
  },
  priceBody: {
    flexDirection: 'row',
    columnGap: 7,
  },
  title: {
    fontSize: 14,
    color: rcp(color.dark, 70),
  },
  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: color.dark,
  },
  discount: {
    fontSize: 15,
    color: rcp(color.dark, 90),
    textDecorationLine: 'line-through',
  },
  info: { rowGap: 10, flex: 1 },
  rightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pisBody: {
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    borderWidth: 0.5,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: rcp(color.dark, 40),
    textAlign: 'center',
    paddingVertical: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    rowGap: 20,
    paddingBottom: Platform.select({ web: 100 }),
  },
  calculation: {
    paddingHorizontal: 10,
    rowGap: 10,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  key: {
    fontSize: 15,
    color: rcp(color.dark, 70),
  },
  value: {
    fontSize: 15,
    color: color.primary,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: rcp(color.dark, 50),
    borderStyle: 'dashed',
  },
  row: {
    flexDirection: 'row',
  },
  btnContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 60,
    backgroundColor: color.weight,
    width: '100%',
    borderTopColor: rcp(color.dark, 20),
    borderTopWidth: 0.5,
  },
});

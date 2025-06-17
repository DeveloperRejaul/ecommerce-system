import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { color } from '@/src/core/constants/color';
import Button from '@/src/core/meter/components/Button';
import { CashIcon } from '@/src/core/assets/icons/cash';
import { useCreateOrderMutation } from '@/src/core/rtk/user-api';
import { getAuthUser } from '@/src/core/db-operations/auth';
import { SHOP_ID } from '@/src/core/constants/constants';
import { IProduct } from '@/types';
import { getAddresses } from '@/src/core/db-operations/address';
import gstyle from '@/gstyle';
// import { GiftIcon } from '@/src/core/assets/icons/gift';

export default function Order() {
  const [createOrder] = useCreateOrderMutation();
  const params = useLocalSearchParams();
  const { priceInfo, products, coupon } = JSON.parse(params.data as string);


  const handleOrder = async () => {
    const user = await getAuthUser();
    const address = await getAddresses();
    const data = {
      products: (products as (IProduct & {pis: number})[]).map((pr) => ({ productId: pr.id, quantity: pr.pis })).filter((p) => p.quantity > 0),
      address: JSON.stringify(address),
      userId: user?.userId || ' ',
      shopId: SHOP_ID,
      couponName: coupon?.name || null,
      price: Number(priceInfo?.totalPrice),
    };
    createOrder(data);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        text="Order"
        iconLeft={Platform.OS !== 'web' ? <ArrowRight style={{ transform: [{ rotate: '180deg' }], marginRight: 10 }} /> : <View/>}
      />
      <View style={gstyle.divider}/>
      <ScrollView>
        <View style={styles.container} className='container'>
          <View style={styles.method}>
            <Text style={styles.title}>Select Payment method</Text>
            <Button
              leftIcon={<CashIcon size={20} color={rcp(color.dark, 50)} />}
              text="Cash on Delivery(Cash/UPI)"
              containerStyle={styles.btn}
              textStyle={{ color: color.dark }}
            />
            <Button
              leftIcon={<CashIcon size={20} color={rcp(color.dark, 50)} />}
              text="Credit/Debit Card"
              containerStyle={{ ...styles.btn, borderColor: rcp(color.dark, 20), opacity: 0.7 }}
              textStyle={{ color: color.dark }}
            />
            <Button
              leftIcon={<CashIcon size={20} color={rcp(color.dark, 50)} />}
              text="Google Pay/Phone Pay/BHIM UPI"
              containerStyle={{ ...styles.btn, borderColor: rcp(color.dark, 20), opacity: 0.7 }}
              textStyle={{ color: color.dark }}
            />
            <Button
              leftIcon={<CashIcon size={20} color={rcp(color.dark, 50)} />}
              text="Payments/Wallet"
              containerStyle={{ ...styles.btn, borderColor: rcp(color.dark, 20), opacity: 0.7 }}
              textStyle={{ color: color.dark }}
            />
            <Button
              leftIcon={<CashIcon size={20} color={rcp(color.dark, 50)} />}
              text="Netbanking"
              containerStyle={{ ...styles.btn, borderColor: rcp(color.dark, 20), opacity: 0.7 }}
              textStyle={{ color: color.dark }}
            />

            {/* <View style={styles.gift}>
              <View style={styles.left}>
                <GiftIcon color={rcp(color.dark, 70)} />
                <Text style={styles.giftText}>Have a gift card?</Text>
              </View>
              <Text style={styles.apply}>Apply?</Text>
            </View> */}
          </View>

          <Text style={styles.title}>
            Price Title(
            {products?.length || 0}
            item)
          </Text>
          <View style={styles.price}>
            <Text style={styles.priceText}>Total MRP</Text>
            <Text style={styles.priceText}>{priceInfo?.Price}</Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceText}>Discount on MRP</Text>
            <Text style={styles.priceText}>
              {priceInfo?.Discount}
            </Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceText}>Tax</Text>
            <Text style={styles.priceText}>
              {priceInfo?.Tax}
            </Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceText}> Delivery Fee</Text>
            <Text style={styles.priceText}>
              {priceInfo['Delivery Fee']}
            </Text>
          </View>
          <View style={[styles.price, { borderBottomWidth: 0.5, borderBottomColor: rcp(color.dark, 40), paddingBottom: 15 }]}>
            <Text style={styles.priceText}>Coupon Discount</Text>
            <Text style={styles.priceText}>
              {priceInfo['Coupon Discount'] || '-৳0'}
            </Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceText}>Total Amount</Text>
            <Text style={styles.totalPrice}>{priceInfo?.totalPrice}</Text>
          </View>
        </View>
      </ScrollView>
      <View className='container'>
        <View style={styles.btnContainer}>
          <View style={[{ columnGap: 7 }]}>
            <Text style={styles.totalPrice}>
              $
              {priceInfo?.totalPrice}
            </Text>
            <Text style={styles.price}>View price details</Text>
          </View>
          <Button
            text="Order Now"
            onPress={handleOrder}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'flex-start',
    columnGap: 10,
    borderColor: color.active,
  },
  container: {
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    borderBottomColor: rcp(color.dark, 20),
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    paddingTop: 10,
  },
  method: {
    rowGap: 10,
  },
  left: {
    flexDirection: 'row',
    columnGap: 10,
  },
  gift: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: rcp(color.dark, 10),
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  giftText: {
    fontWeight: '700',
    color: rcp(color.dark, 90),
  },
  apply: {
    fontWeight: '800',
    color: color.active,
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  priceText: {
    color: rcp(color.dark, 70),
    fontSize: 16,
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
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

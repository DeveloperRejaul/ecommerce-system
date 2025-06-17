import { Text, View, Image, StyleSheet, Pressable, Platform, useWindowDimensions } from 'react-native';
import React from 'react';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { ICardPros } from '@/types';
import { RatingIcon } from '../assets/icons/rating';
import { Utils } from '../utils/utils';
import { urlConvert } from '../utils/file';

export default function SquareCard(props: ICardPros) {
  const { width } = useWindowDimensions();
  return (
    <Pressable
      style={[styles.container, { width: Platform.select({ android: width * 0.45, web: 200 }) }]}
      onPress={props.onPress}
    >
      <Image
        source={{ uri: urlConvert(props.img) }}
        style={{ height: 170, width: '100%', resizeMode: 'cover' }}
      />
      <View style={styles.textBody}>
        <Text style={styles.ratting} numberOfLines={1}>{props.name}</Text>
        <Text style={styles.title} numberOfLines={2}>{props.title}</Text>
        <View style={[styles.row, styles.priceBody]}>
          <Text style={styles.price}>
            ৳
            {props.price}
          </Text>
          {props.discount !== 0 && props.rating !== 0 && (
          <Text style={styles.discount}>
            ৳
            {props.discount + props.price}
          </Text>
          )}
        </View>

        {props.rating !== 0 && (
        <View style={styles.row}>
          <Text style={styles.ratting}>
            {props.rating}
          </Text>
          <RatingIcon size={15} />
          <Text style={styles.review}>(265 Review) </Text>
        </View>
        )}
        {props.rating === 0 && props.discount !== 0 && (
        <View style={[styles.row, { width: '99%' }]}>
          <Text style={styles.discount}>{(props.discount + props.price)}</Text>
          <Text style={styles.present}>
            {`- ${Utils.getPresent(props.discount, props.price)}%`}
          </Text>
        </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { maxHeight: 270, borderWidth: 1.5, borderColor: rcp(color.dark, 5), borderRadius: 5, overflow: 'hidden', paddingBottom: 5 },
  textBody: { paddingHorizontal: 6, rowGap: 1 },
  review: { fontSize: 12, color: rcp(color.dark, 60), marginLeft: 6 },
  ratting: { fontSize: 14, fontWeight: 'bold', color: color.dark, marginRight: 5 },
  wish: { position: 'absolute', right: 5, top: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  priceBody: { columnGap: 10 },
  price: { fontSize: 14, fontWeight: 'bold', color: color.active },
  discount: { fontSize: 12, color: rcp(color.dark, 50), textDecorationLine: 'line-through' },
  title: { fontSize: 12, color: rcp(color.dark, 50) },
  present: { fontSize: 12, color: color.dark },
});

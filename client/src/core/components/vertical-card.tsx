import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { color } from '../constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { Wishlist2Icon } from '../assets/icons/wishlist2';
import { WishlistIcon } from '../assets/icons/wishlist';
import { RatingIcon } from '../assets/icons/rating';
import { urlConvert } from '../utils/file';

interface ICardPros {
  id: string;
  img: string;
  name: string;
  title: string;
  price: number;
  discount: number;
  isFavorite: boolean;
  rating: number;
  onAddFavorite?: () => void
  onRemoveFavorite?: () => void
}
export default function SquareCard(props: ICardPros) {
  const {
    img,
    isFavorite,
    name,
    rating,
    title,
    price,
    discount,
    onAddFavorite,
    onRemoveFavorite,
  } = props;

  return (
    <View style={styles.card}>
      {/* Left Part */}
      <Pressable
        onPress={() => router.navigate({ pathname: '/(stack)/product/[id]', params: { id: props.id, category: '' } })}
      >
        <View style={styles.imgBody}>
          <Image
            source={{ uri: urlConvert(img) }}
            style={styles.img}
          />
          {isFavorite ? (
            <TouchableOpacity onPress={onRemoveFavorite} style={{ position: 'absolute' }}>
              <Wishlist2Icon
                color={color.active}
                style={styles.icon}
                size={24}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onAddFavorite} style={{ position: 'absolute' }}>
              <WishlistIcon
                size={24}
                color={color.active}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </Pressable>

      {/* Right Part */}
      <View className="flex-1">
        <View style={styles.nameBody}>
          <Text style={styles.name}>
            {name}
          </Text>
          <View style={styles.rating}>
            <RatingIcon size={20} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.price}>
          ৳
          {price}
          <Text style={styles.discount}>
            ৳
            {(price + discount)}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  left: {
    width: '30%',
  },
  imgBody: {
    width: 110,
    height: 110,
    borderRadius: 10,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    columnGap: 10,
  },
  name: {
    color: rcp(color.dark, 70),
    fontSize: 14,
  },
  title: {
    color: color.dark,
    fontSize: 18,
  },
  price: {
    color: color.dark,
    fontSize: 18,
    fontWeight: 'bold',
  },
  discount: {
    color: rcp(color.dark, 50),
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  icon: {
    position: 'absolute',
    left: 5,
    top: 5,
  },
  nameBody: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
  },
  ratingText: {
    fontSize: 13,
    color: rcp(color.dark, 50),
  },
});

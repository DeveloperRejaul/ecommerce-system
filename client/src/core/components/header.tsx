import { View, Text, StyleSheet, TouchableOpacity, Platform, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { ShopIcon } from '@/src/core/assets/icons/shop';
import { color } from '@/src/core/constants/color';
import { WishlistIcon } from '@/src/core/assets/icons/wishlist';
import { SearchIcon } from '@/src/core/assets/icons/search';
import Badge from '@/src/core/components/badge';
import { getCardId } from '../db-operations/card';

interface IHeaderProps {
    text: string,
    onCard?: () => void,
    onWishlist?: () => void
    onSearch?: () => void
    iconRight?: React.JSX.Element
    iconLeft?: React.JSX.Element
    containerStyle?:ViewStyle
}

interface IShopCard {
  onPress: () => void
}

/**
 * A functional component that represents the header of a screen.
 * It includes a title, optional left and right icons, and action buttons.
 *
 * @param props - The properties for the Header component.
 * @param props.text - The title text to be displayed in the header.
 * @param props.onCard - An optional function to be called when the shopping cart icon is pressed.
 * @param props.onSearch - An optional function to be called when the search icon is pressed.
 * @param props.onWishlist - An optional function to be called when the wishlist icon is pressed.
 * @param props.iconRight - An optional JSX element to be displayed on the right side of the header.
 * @param props.iconLeft - An optional JSX element to be displayed on the left side of the header.
 * @param props.containerStyle - An optional style object to be applied to the header container.
 *
 * @returns - A React element representing the Header component.
 */
export default function Header({ text, onCard, onSearch, onWishlist, iconRight, iconLeft, containerStyle }: IHeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.con, containerStyle]} className="container">
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {iconLeft && (
        <TouchableOpacity onPress={() => router.back()}>
          {iconLeft}
        </TouchableOpacity>
        )}
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{text}</Text>
      </View>
      <View style={{ flexDirection: 'row', columnGap: 15 }}>
        {onSearch && (
        <TouchableOpacity onPress={onSearch}>
          <SearchIcon color={color.primary} size={28} />
        </TouchableOpacity>
        )}
        {onWishlist && (
        <TouchableOpacity onPress={onWishlist}>
          <WishlistIcon color={color.primary} size={25} />
        </TouchableOpacity>
        )}
        {onCard && <ShopCard onPress={onCard} />}
        {iconRight}
      </View>
    </View>
  );
}

/**
 * A functional component that represents a shopping cart icon with a badge displaying the number of items in the cart.
 *
 * @param props - The properties for the ShopCard component.
 * @param props.onPress - A function to be called when the ShopCard is pressed.
 *
 * @returns - A React element representing the ShopCard component.
 */
function ShopCard(props: IShopCard) {
  const { onPress } = props;
  const [badgeNum, setBadgeNum] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const data = await getCardId();
      setBadgeNum(data?.length || 0);
    })();
  }, [isFocused]);

  return (
    <TouchableOpacity onPress={onPress} style={{ zIndex: 1 }}>
      {badgeNum ? <Badge num={badgeNum} style={styles.badge} /> : null}
      <ShopIcon color={color.primary} size={25} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  con: {
    height: Platform.select({ web: 50, android: 80, ios: 80 }),
    flexDirection: 'row',
    alignItems: Platform.select({ android: 'flex-end', ios: 'flex-end', web: 'center' }),
    justifyContent: 'space-between',
    paddingBottom: Platform.select({ android: 12, ios: 12 }),
    paddingHorizontal: 10,
  },
  badge: {
    position: 'absolute',
    right: -7,
    top: -7,
    zIndex: 2,
  },
});

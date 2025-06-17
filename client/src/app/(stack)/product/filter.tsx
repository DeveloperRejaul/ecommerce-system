/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { randomId } from '@/src/core/meter/utils/random';
import { CheckBox } from '@/src/core/meter/components/CheckBox';
import { CheckIcon } from '@/src/core/assets/icons/check';
import Button from '@/src/core/meter/components/Button';

type CategoryItem = { [key: string]: boolean };
type ListItemsType = {
  [category: string]: {
    item: CategoryItem;
    isActive: boolean;
  };
};

const ITEM_HIGHT = 50;

export default function Filter() {
  const [listItems, setListItems] = useState<ListItemsType>({
    Gender: {
      item: { male: false, female: false },
      isActive: false,
    },
    Discount: {
      item: { 10: false, 20: false, 30: false, 40: false, 50: false, 60: false, 70: false, 80: false, 90: false },
      isActive: false,
    },
    Size: {
      item: { '2xs': false, xs: false, s: false, m: false, l: false, xl: false, '2xl': false, '3xl': false },
      isActive: false,
    },
    Price: {
      item: { 'Under Tk. 499': false, 'Tk. 500-699': false, 'Tk. 700-999': false, 'Tk. 1000-1499': false, 'Tk. 1500-1999': false, 'Tk. 2000 and above': false },
      isActive: false,
    },
    'Customer Ratings': {
      item: { '5★ & above': false, '4★ & above': false, '3★ & above': false, '2★ & above': false, '1★ & above': false },
      isActive: false,
    },
    Type: {
      item: { 'Leather Jacket': false, 'Bombet Jacke': false, 'Nehru Jacket': false, 'Denim Jacket': false, 'Puffer Jacket': false, 'Fleece Jacket': false },
      isActive: false,
    },
    Occasion: {
      item: { Casual: false, Sports: false, Formal: false },
      isActive: false,
    },
    Brand: {
      item: { Roadster: false, 'Peter England': false, 'Flying Machine': false, Killer: false, "Levi's": false, Puma: false, Wildcraft: false, Ndet: false, Woodland: false },
      isActive: false,
    },
    Color: {
      item: { Black: false, Blue: false, Maroon: false, Green: false, White: false, 'Light Blue': false, Beige: false, Brown: false, Gold: false },
      isActive: false,
    },
    Sleeve: {
      item: { 'Full Sleeve': false, Sleeveless: false, 'Short Sleeve': false },
      isActive: true,
    },
    Fabric: {
      item: { 'Genuine Leather': false, 'Cotton Blend': false, 'Poly Silk': false, 'Pure Linen': false, 'Lycra Blend': false, Velvet: false, 'Cotton Linen': false, 'Cotton Lycra': false, Denim: false, 'Faux Leather': false, Nylon: false, Polycotton: false, 'Wool Blend': false },
      isActive: false,
    },
    Offers: {
      isActive: false,
      item: { 'Buy More, Save More': false, 'No Cost EMI': false, 'Special Price': false },
    },
    Theme: {
      item: { 'Leather Jackets': false, 'Mandarian Collar': false, 'Sporty Jacket': false, 'Quited Quotient': false, 'Modern Classics': false, Bomber: false, 'Light Weight Bombers': false, 'Everyday Bombers': false, Florals: false, 'Open Front': false, 'Puffer Jacket': false },
      isActive: false,
    },
    Reversible: {
      isActive: false,
      item: { Yes: false, No: false },
    },
    Pattern: {
      isActive: false,
      item: { Chevron: false, Embossed: false, Perforation: false, 'Animal Print': false, Embellished: false, Holographic: false, Applique: false, Colorblock: false, Printed: false, Solid: false },
    },
    Availability: {
      isActive: false,
      item: { 'Include Out of Stock': false },
    },
  });

  const handleButton = (clickedKey: string) => {
    setListItems((prev) => ({
      ...prev,
      [clickedKey]: {
        ...prev[clickedKey],
        isActive: true,
      },
      ...Object.fromEntries(
        Object.keys(prev)
          .filter((key) => key !== clickedKey)
          .map((key) => [key, { ...prev[key], isActive: false }]),
      ),
    }));
  };

  const handleCheck = (clickedKey:string, value:string) => {
    setListItems((prev) => ({
      ...prev,
      [clickedKey]: {
        ...prev[clickedKey],
        item: {
          ...prev[clickedKey].item,
          [value]: !prev[clickedKey].item[value],
        },
      },
    }));
  };

  const handleApply = () => {};
  return (
    <View>
      <Header text="Filter" iconLeft={<ArrowRight style={{ transform: [{ rotate: '180deg' }], marginRight: 10 }} />} />
      {/* Clickable List */}
      <View style={styles.btn}>
        <Button text="Apply" onPress={handleApply} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 110 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: rcp(color.dark, 5) }}
            contentContainerStyle={{ paddingBottom: 250 }}
          >
            {Object.keys(listItems).map((item) => (
              <Pressable
                onPress={() => handleButton(item)}
                key={randomId()}
                style={[styles.pressBtn, listItems[item].isActive ? { backgroundColor: color.weight } : {}]}
              >
                <Text style={styles.btnText}>{item}</Text>
                <View style={[styles.bar, listItems[item].isActive ? { backgroundColor: color.active } : {}]} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 10, rowGap: 7 }}>
          {Object.keys(listItems).map((key) => {
            if (listItems[key].isActive) {
              return Object.keys(listItems[key].item).map((item) => (
                <View key={randomId()} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.itemText}>{item}</Text>
                  <CheckBox
                    defaultIsChecked={listItems[key].item[item]}
                    value={item}
                    onChange={(value) => handleCheck(key, value.toString())}
                    boxStyle={{ borderColor: color.active, borderWidth: 2 }}
                    boxActiveStyle={{ backgroundColor: color.active }}
                    checkIcon={<CheckIcon color={color.weight} size={15} />}
                  />
                </View>
              ));
            }
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressBtn: {
    justifyContent: 'center',
    paddingLeft: 10,
    height: ITEM_HIGHT,
  },
  btnText: {
    color: color.dark,
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemText: {
    color: color.dark,
    fontWeight: '500',
    fontSize: 16,
  },
  bar: {
    width: 4,
    height: ITEM_HIGHT,
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  btn: {
    position: 'absolute',
    bottom: 80,
    zIndex: 2,
    backgroundColor: color.weight,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 0.5,
    borderTopColor: rcp(color.dark, 40),
  },
});

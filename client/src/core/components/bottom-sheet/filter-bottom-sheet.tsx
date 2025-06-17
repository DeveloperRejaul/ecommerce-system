import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { CloseIcon } from '@/src/core/assets/icons/close';
import { bottomSheet } from '@/src/core/meter/components/BottomSheet';
import { color } from '@/src/core/constants/color';
import { CheckBox } from '@/src/core/meter/components/CheckBox';
import { CheckIcon } from '@/src/core/assets/icons/check';
import { styles } from './styles';
import type{ IBrandBottomSheetProps, IDiscountBottomSheetProps, ISortByBottomSheetProps, SortByBottomSheetItemPressParams } from '@/types';
import { useGetBrandQuery } from '../../rtk/shop-api';
import BottomSheetContainer from './bottom-container';

// Sort by bottom sheet
/**
 * A component that renders a bottom sheet for sorting products.
 *
 * @param props - The props for the component.
 * @param props.onPress - A function to be called when a sort option is selected.
 *
 * @returns - A React component for the SortByBottomSheet.
 */
export function SortByBottomSheet({ onPress } : ISortByBottomSheetProps) {
  const [sortTypes, setSorts] = useState([
    { text: 'What\'s new', border: 3 },
    { text: 'Price - high to low', border: 3 },
    { text: 'Price - low to high', border: 3 },
    { text: 'Popularity', border: 3 },
    { text: 'Discount', border: 3 },
  ]);

  /**
   * Handles the press event of a sort option.
   * @param name - The name of the selected sort option.
   */
  const handleSortPress = (name:SortByBottomSheetItemPressParams) => {
    onPress(name);
    setSorts((pre) => pre.map((data) => {
      if (data.text === name) return { ...data, border: 5 };
      return { ...data, border: 3 };
    }));
  };

  return (
    <View style={styles.sortContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
        <TouchableOpacity onPress={() => bottomSheet.hide()}>
          <CloseIcon color={color.dark} size={35} />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, fontWeight: 'semibold' }}>Filter </Text>
      </View>
      {sortTypes.map((ele) => (
        <View style={styles.sortBody} key={ele.text}>
          <Text style={styles.sortText}>{ele.text}</Text>
          <Pressable onPress={() => handleSortPress(ele.text as SortByBottomSheetItemPressParams)}>
            <View style={[styles.sortBall, { borderWidth: ele.border }]} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const brands:string[] = [];
/**
 * A component that renders a bottom sheet for filtering products by brand.
 *
 * @param props - The props for the component.
 * @param props.onChange - A function to be called when a brand is selected or deselected.
 *
 * @returns - A React component for the BrandBottomSheet.
 */
export function BrandBottomSheet(props: IBrandBottomSheetProps) {
  const { data, isLoading, isFetching, isError } = useGetBrandQuery({});

  return (
    <View style={styles.sortContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
        <TouchableOpacity onPress={() => bottomSheet.hide()}>
          <CloseIcon color={color.dark} size={35} />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, fontWeight: 'semibold' }}>Filter</Text>
      </View>
      <BottomSheetContainer {...{ isError, isLoading: isFetching || isLoading }}>
        {data?.map((ele) => (
          <View style={styles.sortBody} key={ele.id}>
            <Text style={styles.sortText}>{ele.name}</Text>
            <CheckBox
              value={ele.id}
              onChange={(value) => {
                if (brands.includes(value.toString())) {
                  brands.splice(brands.indexOf(value.toString()), 1);
                } else {
                  brands.push(value.toString());
                }
                props.onChange(brands);
              }}
              boxStyle={{ borderColor: color.active, borderWidth: 2 }}
              boxActiveStyle={{ backgroundColor: color.active }}
              checkIcon={<CheckIcon color={color.weight} size={15} />}
            />
          </View>
        ))}
      </BottomSheetContainer>
    </View>
  );
}

const activesValues:number[] = [];
/**
 * A component that renders a bottom sheet for filtering products by discount.
 *
 * @param props - The props for the component.
 * @param props.onChange - A function to be called when a discount is selected or deselected.
 *
 * @returns - A React component for the DiscountBottomSheet.
 */
export function DiscountBottomSheet(props: IDiscountBottomSheetProps) {
  const discount = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <View style={styles.sortContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
        <TouchableOpacity onPress={() => bottomSheet.hide()}>
          <CloseIcon color={color.dark} size={35} />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, fontWeight: 'semibold' }}>Filter</Text>
      </View>
      {discount.map((ele) => (
        <View style={styles.sortBody} key={ele}>
          <Text style={styles.sortText}>
            {ele}
            %
          </Text>
          <CheckBox
            value={ele}
            onChange={(value) => {
              if (activesValues.includes(value as number)) {
                activesValues.splice(activesValues.indexOf(value as number), 1);
              } else {
                activesValues.push(value as number);
              }
              props.onChange(activesValues);
            }}
            boxStyle={{ borderColor: color.active, borderWidth: 2 }}
            boxActiveStyle={{ backgroundColor: color.active }}
            checkIcon={<CheckIcon color={color.weight} size={15} />}
            defaultIsChecked={false}
          />
        </View>
      ))}
    </View>
  );
}

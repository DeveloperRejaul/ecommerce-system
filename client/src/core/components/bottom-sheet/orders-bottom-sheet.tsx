import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { color } from '../../constants/color';
import { CloseIcon } from '../../assets/icons/close';
import { bottomSheet } from '../../meter/components/BottomSheet';
import { CheckBox } from '../../meter/components/CheckBox';
import { CheckIcon } from '../../assets/icons/check';
import { randomId } from '../../meter/utils/random';
import type{ IOrdersBottomSheet } from '@/types';

/**
 * A component that renders a bottom sheet with filter options for orders.
 *
 * @param props - The properties for the OrdersBottomSheet component.
 * @param props.select - An array of objects representing the filter options.
 * @param props.onChange - A callback function to handle changes in the filter options.
 *
 * @returns - A React component that displays the bottom sheet with filter options.
 */
export function OrdersBottomSheet(props: IOrdersBottomSheet) {
  const handleChange = (value:string) => {
    const data = props.select.map((ele) => {
      if (ele.label === value) return { ...ele, isActive: !ele.isActive };
      return ele;
    });
    props.onChange(data);
  };

  return (
    <View style={styles.sortContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
        <TouchableOpacity onPress={() => bottomSheet.hide()}>
          <CloseIcon color={color.dark} size={35} />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, fontWeight: 'semibold' }}>Filter</Text>
      </View>
      {props.select.map((ele) => (
        <View style={styles.sortBody} key={randomId()}>
          <Text style={styles.sortText}>{ele.label}</Text>
          <CheckBox
            defaultIsChecked={ele.isActive}
            value={ele.label}
            onChange={(value) => handleChange(value.toString())}
            boxStyle={{ borderColor: color.active, borderWidth: 2 }}
            boxActiveStyle={{ backgroundColor: color.active }}
            checkIcon={<CheckIcon color={color.weight} size={15} />}
          />
        </View>
      ))}
    </View>
  );
}

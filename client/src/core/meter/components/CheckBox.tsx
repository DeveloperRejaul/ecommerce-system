import React, { useState } from 'react';
import { Pressable, Text, TextStyle, ViewProps, ViewStyle } from 'react-native';

interface ICheckBox extends ViewProps {
  onChange?: (value: string | number | boolean) => void;
  defaultIsChecked?: boolean;
  isDisabled?: boolean
  borderColor?: string
  size?: number
  checkIcon?: React.JSX.Element
  boxStyle?: ViewStyle
  boxActiveStyle?: ViewStyle
  boxInactiveStyle?: ViewStyle
  checkStyle?: TextStyle
  checkActiveStyle?: TextStyle
  checkInactiveStyle?: TextStyle
  boxStyleClassName?: string;
  checkStyleClassName?: string;
  value?: string | number
}

export function CheckBox(props: ICheckBox) {
  const {
    defaultIsChecked = false,
    isDisabled = false,
    borderColor = 'black',
    size = 20,
    checkIcon,
    checkStyle,
    boxStyle,
    boxActiveStyle,
    boxInactiveStyle,
    boxStyleClassName,
    checkStyleClassName,
    checkActiveStyle,
    checkInactiveStyle,
    onChange,
    value,
  } = props;
  const [select, setSelect] = useState<boolean>(defaultIsChecked);

  return (
    <Pressable
      pointerEvents={isDisabled ? 'none' : 'auto'}
      style={[{
        borderWidth: 1,
        borderColor,
        height: size,
        width: size,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        opacity: isDisabled ? 0.5 : 1,
        ...boxStyle,
      }, select ? boxActiveStyle : boxInactiveStyle]}
      onPress={() => setSelect((pre) => {
        onChange?.(value || !select);
        return !pre;
      })}
      {...{ className: boxStyleClassName }}
    >
      {select ? checkIcon || <Text style={[checkStyle, select ? checkActiveStyle : checkInactiveStyle]} {...{ className: checkStyleClassName }}>✓</Text> : null}
    </Pressable>
  );
}

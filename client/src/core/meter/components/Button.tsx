import { Text, ViewStyle, StyleSheet, TextStyle, ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { color as COLOR } from '../../constants/color';

export interface IButton extends TouchableOpacityProps {
    text?:string
    leftIcon?: React.JSX.Element
    rightIcon?: React.JSX.Element
    containerStyle?: ViewStyle;
    textStyle?: TextStyle
    variant?: 'solid' | 'outline' | 'link'
    action?:'primary' | 'secondary' | 'positive' | 'negative'
    isDisabled?:boolean;
    isLoading?:boolean
}

export default function Button(props : IButton) {
  const {
    text = 'Hello World!',
    containerStyle,
    leftIcon,
    rightIcon,
    textStyle,
    variant = 'solid',
    action = 'primary',
    isDisabled,
    isLoading,
    ...extra
  } = props;

  const color = {
    primary: COLOR.active,
    secondary: '#8E24AA',
    positive: '#43A047',
    negative: '#D32F2F',
  };

  const style = {
    solid: {
      backgroundColor: color[action],
    },
    outline: {
      borderWidth: 1,
      borderColor: color[action],
    },
    link: {},
  };

  return (
    <TouchableOpacity
      className="cursor-pointer"
      activeOpacity={0.7}
      disabled={isDisabled}
      style={[styles.container, { opacity: isDisabled ? 0.5 : 1 }, style[variant], containerStyle]}
      {...extra}
    >
      {leftIcon}
      {isLoading ? <ActivityIndicator size={20} color="#fff" /> : <Text style={[styles.text, textStyle, variant === 'link' && { textDecorationLine: 'underline' }]}>{text}</Text>}
      {rightIcon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
    color: COLOR.weight,
    alignSelf: 'center',
  },
});

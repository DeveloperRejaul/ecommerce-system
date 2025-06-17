import { StyleSheet } from 'react-native';
import { rcp } from './src/core/meter/utils/colorReduceOpacity';
import { color } from './src/core/constants/color';

export default StyleSheet.create({
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: rcp(color.dark, 15),
  },
});

import { StyleSheet } from 'react-native';
import { color } from '@/src/core/constants/color';

export const styles = StyleSheet.create({
  sortContainer: {
    paddingVertical: 10,
    paddingTop: 20,
    rowGap: 10,
  },
  sortBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sortText: { fontSize: 15, color: color.dark, fontWeight: '500' },
  sortBall: { width: 20, height: 20, borderRadius: 10, borderColor: color.active },
});

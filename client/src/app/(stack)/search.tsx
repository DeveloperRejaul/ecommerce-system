import { KeyboardAvoidingView, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Input from '@/src/core/meter/components/Input';
import { SearchIcon } from '@/src/core/assets/icons/search';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { CloseIcon } from '@/src/core/assets/icons/close';
import Button from '@/src/core/meter/components/Button';
import { ClockIcon } from '@/src/core/assets/icons/clock';
import { ArrowLeft } from '@/src/core/assets/icons/arrow-left';
import { randomId } from '@/src/core/meter/utils/random';
import { createHistory, getHistory, IHistoryBD } from '@/src/core/db-operations/history';
import gstyle from '@/gstyle';

export default function Search() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [history, setHistory] = useState<IHistoryBD[]>([] as IHistoryBD[]);

  useLayoutEffect(() => {
    (async () => {
      const data = await getHistory();
      setHistory(data);
    })();
  }, []);

  const handleSearch = async () => {
    await createHistory(searchValue);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View className='container'>
         <Input
            value={searchValue}
            containerStyle={styles.inputBody}
            leftIcon={(
              <TouchableOpacity onPress={handleSearch}>
                <SearchIcon color={color.active} size={25} />
              </TouchableOpacity>
            )}
            rightIcon={(
              <TouchableOpacity onPress={() => setSearchValue('')}>
                <CloseIcon color={color.active} size={20} />
              </TouchableOpacity>
              )}
            activeBorderColor={rcp(color.dark, 50)}
            onChangeText={(text) => setSearchValue(text)}
          />
      </View>
      <View style={gstyle.divider}/>
      <View className='flex flex-1 justify-between pb-10'>
        <View className='container'>
            {/* Body */}
            <ScrollView contentContainerStyle={styles.scrollViewContainer} showsHorizontalScrollIndicator={false}>
              {history
                .filter((h) => h?.value?.includes(searchValue))
                ?.filter((hs) => hs?.value !== searchValue)
                ?.toReversed()?.map((his) => (
                  <Pressable key={randomId()} style={styles.hisBody} onPress={() => setSearchValue(his.value)}>
                    <View style={styles.hisLeft}>
                      <ClockIcon color={color.active} />
                      <Text style={styles.hisText}>{his.value}</Text>
                    </View>
                    <ArrowLeft color={(rcp(color.dark, 70))} style={{ transform: [{ rotate: '45deg' }] }} />
                  </Pressable>
                ))}
            </ScrollView>
          </View>
          <View className='container'>
            <Button
              variant="outline"
              text="Go Back"
              textStyle={{ color: color.dark }}
              onPress={() => router.back()}
            />
          </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  inputBody: {
    paddingTop: StatusBar.currentHeight,
    borderWidth:0,
    borderRadius: 0,
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    paddingHorizontal: 10,
  },
  hisBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    paddingVertical: 2,
  },
  hisText: {
    color: color.dark,
    fontSize: 14,
  },
  hisLeft: {
    flexDirection: 'row',
    columnGap: 10,
    width: '70%',
  },
});

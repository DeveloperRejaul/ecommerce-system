import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { color } from '@/src/core/constants/color';
import Button from '@/src/core/meter/components/Button';
import { randomId } from '@/src/core/meter/utils/random';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { IAddress } from '@/types';
import { getAddresses, removeAddress } from '@/src/core/db-operations/address';
import gstyle from '@/gstyle';

export default function SavedAddress() {
  const router = useRouter();
  const [address, setAddress] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const addresses = await getAddresses();
        setAddress(addresses);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    })();
  }, [isFocused]);

  const handleRemove = async (data: IAddress) => {
    try {
      const isSuccess = await removeAddress(data.type);
      if (isSuccess) setAddress((pre) => pre.filter((d) => d.type !== data.type));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header
        text="Address"
        iconLeft={Platform.OS === 'web' ? <View /> : <ArrowRight style={{ transform: [{ rotate: '180deg' }], marginRight: 10 }} />}
      />
      <View style={gstyle.divider} />
      <View style={styles.container} className="container">
        {isLoading && <ActivityIndicator />}
        {(!address || (address?.length < 2)) && (
          <Button
            text="+ Add new Address"
            variant="outline"
            textStyle={{ color: color.active }}
            onPress={() => router.navigate({ pathname: '/profile/address', params: { from: 'CREATE' } })}
            containerStyle={{ marginBottom: 20 }}
          />
        )}
        <ScrollView contentContainerStyle={{ rowGap: 10 }}>
          {address?.map((ele) => (
            <View
              key={randomId()}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.name}>
                  {ele?.name}
                </Text>
                <View style={styles.rightBody}>
                  {ele?.isDefault && <Text style={styles.default}>Default</Text>}
                  <Text style={styles.type}>{ele?.type?.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.text}>{`Address: ${ele?.address}`}</Text>
              <Text style={styles.text}>{`District: ${ele?.district}`}</Text>
              <Text style={styles.text}>{`Town: ${ele?.town}`}</Text>
              <Text style={styles.text}>{`State: ${ele?.state}`}</Text>
              <Text style={styles.text}>
                Post office:
                {ele?.code}
              </Text>
              <Text style={styles.text}>
                Mobile:
                {ele?.phone}
              </Text>
              <View style={styles.btnBody}>
                <View style={[styles.btn, { borderRightWidth: 0.5 }]}>
                  <TouchableOpacity onPress={() => handleRemove(ele)}>
                    <Text style={[styles.btnText, { color: color?.active }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.btn}>
                  <TouchableOpacity
                    onPress={() => router.navigate({
                      // default value boolean not supported, thats way convert to string
                      pathname: '/profile/address', params: { ...ele, isDefault: ele.isDefault ? 'true' : 'false', from: 'UPDATE' },
                    })}
                  >
                    <Text style={styles.btnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 10,
  },
  card: {
    borderWidth: 0.5,
    borderColor: rcp(color.dark, 70),
    borderRadius: 10,
    // paddingHorizontal: 15,
    paddingTop: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  name: {
    color: color.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  type: {
    backgroundColor: color.active,
    color: color.weight,
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  text: {
    color: rcp(color.dark, 70),
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 10,
  },
  btnBody: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: rcp(color.dark, 70),
    width: '50%',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 8,
    color: color.dark,
  },
  rightBody: { flexDirection: 'row', columnGap: 20, alignItems: 'center' },
  default: {
    borderWidth: 1,
    borderColor: color.active,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: color.active,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

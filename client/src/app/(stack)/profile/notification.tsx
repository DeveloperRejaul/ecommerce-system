import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Header from '@/src/core/components/header';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { color } from '@/src/core/constants/color';
import { NotificationIcon } from '@/src/core/assets/icons/notification';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { TimeIcon } from '@/src/core/assets/icons/time';
import { randomId } from '@/src/core/meter/utils/random';

export default function notification() {
  const notification = [
    {
      title: 'Cashback 10%',
      dis: 'Get 10% cashback for the next top up',
      isClicked: false,
      createdAt: Date.now(),
    },
    {
      title: 'Cashback 10%',
      dis: 'Get 10% cashback for the next top up',
      isClicked: false,
      createdAt: Date.now(),
    },
    {
      title: 'Cashback 10%',
      dis: 'Get 10% cashback for the next top up',
      isClicked: true,
      createdAt: Date.now(),
    },
    {
      title: 'Cashback 10%',
      dis: 'Get 10% cashback for the next top up',
      isClicked: false,
      createdAt: Date.now(),
    },
    {
      title: 'Cashback 10%',
      dis: 'Get 10% cashback for the next top up',
      isClicked: false,
      createdAt: Date.now(),
    },
  ];

  return (
    <>
      <Header
        text="Notification"
        iconLeft={<ArrowRight style={{ transform: [{ rotate: '180deg' }], marginRight: 10 }} />}
        containerStyle={{ borderBottomColor: color.dark, borderWidth: 0.5 }}
      />
      <View>
        <View>
          <View style={styles.header}>
            <Text style={styles.headerRight}> Today  </Text>
            <Text style={styles.headerLeft}> Mark as read </Text>
          </View>
          {notification.map((ele) => (
            <View key={randomId()} style={styles.itemBody}>
              <View style={{ flexDirection: 'row', columnGap: 10 }}>
                <View style={styles.itemLeft}>
                  {ele.isClicked || <View style={styles.bgd} />}
                  <NotificationIcon size={35} />
                </View>
                <View>
                  <Text style={styles.heading}>{ ele.title }</Text>
                  <Text style={styles.mute}>{ele.dis}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TimeIcon color={rcp(color.dark, 80)} size={17} />
                <Text style={styles.mute}> 5 hr ago</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerRight: {
    fontWeight: '800',
    fontSize: 15,
    color: color.primary,
  },
  headerLeft: {
    color: color.active,
    fontSize: 14,
  },
  itemLeft: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: rcp(color.active, 10),
  },
  bgd: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 10,
    zIndex: 99,
    backgroundColor: rcp(color.yellow, 70),
    top: -3,
    right: -3,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 14,
    color: color.dark,
  },
  mute: {
    color: rcp(color.dark, 70),
    fontSize: 12,
  },
  itemBody: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: rcp(color.dark, 50),
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
  },
});

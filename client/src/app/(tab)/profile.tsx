import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Avatar from '@/src/core/components/avatar';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { PencilIcon } from '@/src/core/assets/icons/pencil';
import { WishlistIcon } from '@/src/core/assets/icons/wishlist';
import { BoxIcon } from '@/src/core/assets/icons/box';
import { GiftIcon } from '@/src/core/assets/icons/gift';
import { HelpIcon } from '@/src/core/assets/icons/help';
import { ArrowRight } from '@/src/core/assets/icons/arrow-right';
import { ProfileIcon } from '@/src/core/assets/icons/profile';
import { LocationIcon } from '@/src/core/assets/icons/location';
import { BallIcon } from '@/src/core/assets/icons/bell';
import { LogoutIcon } from '@/src/core/assets/icons/logout';
import Badge from '@/src/core/components/badge';
import { withAuth } from '@/src/core/components/HOC/withAuth';
import { IAuthData, removeAuthUser } from '@/src/core/db-operations/auth';
import { animatedAlert } from '@/src/core/components/AnimatedAlert';

type FeaturesParamsTypes = 'Order' | 'Wishlist' | 'Coupons' | 'Help Center'
type ListItemsParamsTypes = 'Edit Profile' | 'Saved Addresses' | 'Notification' | 'Log Out' | 'Developer About'

function Profile(props: IAuthData) {
  const notification: number = 5;
  const features = [
    { icon: BoxIcon, name: 'Order', isEnabled: true },
    { icon: WishlistIcon, name: 'Wishlist', isEnabled: true },
    { icon: GiftIcon, name: 'Coupons', isEnabled: true },
    { icon: HelpIcon, name: 'Help Center', isEnabled: false },
  ];
  const listItems = [
    { Icon: ProfileIcon, text: 'Edit Profile', isEnabled: true },
    { Icon: LocationIcon, text: 'Saved Addresses', isEnabled: true },
    { Icon: BallIcon, text: 'Notification', isEnabled: false },
    // { Icon: InfoIcon, text: 'Developer About', isEnabled: true },
    { Icon: LogoutIcon, text: 'Log Out', isEnabled: true },
  ];

  const handleFeatures = (name:FeaturesParamsTypes) => {
    switch (name) {
      case 'Wishlist':
        router.push('/wishlist');
        break;
      case 'Help Center':
        router.push('/profile/help');
        break;
      case 'Coupons':
        router.push('/profile/coupons');
        break;
      case 'Order':
        router.push('/profile/orders');
        break;
      default:
        break;
    }
  };
  const handleItems = async (name:ListItemsParamsTypes) => {
    switch (name) {
      case 'Edit Profile':
        router.push({ pathname: '/profile/edit-profile', params: { ...props } });
        break;
      case 'Notification':
        router.push('/profile/notification');
        break;
      case 'Saved Addresses':
        router.push('/profile/saved-address');
        break;
      case 'Developer About':
        router.push('/(stack)/developer-about');
        break;

      case 'Log Out':
        animatedAlert.show({ message: 'Are you sure you want to log out' }, async (ans) => {
          if (ans === 'ok') {
            await removeAuthUser();
            router.push('/auth');
          }
        });
        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.container} className="container">
      {/* Avatar Profile image part */}
      <View style={styles.avatarBody}>
        <View style={styles.left}>
          <Avatar src={props?.avatar} />
          <View>
            <Text style={styles.heading}>
              {props.name || ''}
            </Text>
            <Text style={styles.id}>{props.email}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push({ pathname: '/profile/edit-profile', params: { ...props } })}>
          <PencilIcon color={color.active} />
        </TouchableOpacity>
      </View>

      {/* Features part  */}
      <View style={styles.featureBody}>
        {features.map((ele) => (
          <TouchableOpacity
            className="w-[48%]"
            disabled={!ele.isEnabled}
            key={ele.name}
            style={[styles.iconBody, { opacity: ele.isEnabled ? 1 : 0.8 }]}
            onPress={() => handleFeatures(ele.name as FeaturesParamsTypes)}
          >
            <ele.icon color={color.active} />
            <Text style={styles.heading}>{ele.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Account Setting  */}
      <View style={styles.setting}>
        <Text style={[styles.heading, { color: color.primary, fontSize: 18, paddingBottom: 10 }]}>Account Settings</Text>

        {listItems.map((({ Icon, text, isEnabled }) => (
          <TouchableOpacity
            disabled={!isEnabled}
            key={text}
            style={[styles.listBody, { opacity: isEnabled ? 1 : 0.8 }]}
            onPress={() => handleItems(text as ListItemsParamsTypes)}
          >
            <View style={styles.settingLeft}>
              <Icon color={rcp(color.dark, 50)} size={24} />
              <Text style={styles.title}>{text}</Text>
              {text.toLowerCase() === 'notification' && notification > 0 && (<Badge num={notification} />)}
            </View>
            <ArrowRight color={rcp(color.dark, 50)} />
          </TouchableOpacity>
        )))}
      </View>
    </View>
  );
}

export default withAuth(Profile);

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  avatarBody: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    color: color.dark,
  },
  id: {
    color: rcp(color.dark, 50),
  },
  featureBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    columnGap: 8,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  iconBody: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: rcp(color.active, 20),
    borderWidth: 2,
    borderColor: rcp(color.dark, 5),
    borderRadius: 10,
    paddingVertical: 10,
  },
  setting: {
    paddingHorizontal: 10,
  },
  listBody: {
    flexDirection: 'row',
    paddingVertical: 10,
    columnGap: 10,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: rcp(color.dark, 20),
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    color: color.dark,
  },
});

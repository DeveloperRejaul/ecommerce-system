/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/no-unstable-nested-components */
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { CategoryIcon } from '@/src/core/assets/icons/category';
import { HomeIcon } from '@/src/core/assets/icons/home';
import { ProfileIcon } from '@/src/core/assets/icons/profile';
import { WishlistIcon } from '@/src/core/assets/icons/wishlist';
import { color } from '@/src/core/constants/color';
import { rcp } from '@/src/core/meter/utils/colorReduceOpacity';
import { IconProps } from '@/src/core/assets/icons/types';

export default function Tab() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
        },
      }}
      // @ts-ignore
      tabBar={(props) => <CustomTabs {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="category" />
      <Tabs.Screen name="wishlist" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function CustomTabs(props: BottomTabBarProps) {
  const { navigation, state } = props;
  const onPress = (key: string, routeName: string) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) navigation.navigate(routeName);
  };
  return (
    <View className="border border-t border-t-zinc-200">
      <View className="flex-row justify-around pb-2 container">
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { Icon } = tabInfo[route.name];
          return (
            <Pressable key={route.name} onPress={() => onPress(route.key, route.name)} className="items-center">
              {focused ? <View style={styles.bar} /> : <View />}
              <View className="items-center pt-2 md:flex-row lg:gap-x-2">
                <Icon color={focused ? color.active : rcp(color.dark, 70)} />
                <Text style={[styles.text, { color: focused ? color.active : rcp(color.dark, 70) }]}>{tabInfo[route.name].name}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const tabInfo:Record<string, {name:string, Icon:FC<IconProps>}> = {
  index: {
    name: 'Home',
    Icon: HomeIcon,
  },
  category: {
    name: 'Category',
    Icon: CategoryIcon,
  },
  wishlist: {
    name: 'Wishlist',
    Icon: WishlistIcon,
  },
  profile: {
    name: 'Profile',
    Icon: ProfileIcon,
  },
};

const styles = StyleSheet.create({
  bar: {
    height: 5,
    width: '100%',
    backgroundColor: color.active,
    position: 'absolute',
    top: 0,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  text: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

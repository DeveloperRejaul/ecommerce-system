import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import SpaceMono from '@/src/core/assets/fonts/SpaceMono-Regular.ttf';
import 'react-native-reanimated';
import { BottomSheetContainer } from '@/src/core/meter/components/BottomSheet';
import { store } from '@/src/core/rtk/store';
import AnimatedAlert from '@/src/core/components/AnimatedAlert';
import AnimatedToast from '../core/components/AnimatedToast';
import Main from '@/src/core/components/Main';

// Prevent the splash screen from auto-hiding befzrore asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      <Provider store={store}>
        <Main>
          <StatusBar />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <BottomSheetContainer />
          <AnimatedAlert />
          <AnimatedToast />
        </Main>
      </Provider>
    </View>
  );
}

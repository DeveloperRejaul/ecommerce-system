import { Text, View, TouchableOpacity } from 'react-native';
import { InfoIcon } from '../assets/icons/info';

export default function Expire() {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="items-center">
        <InfoIcon size={48} color="#FF3B30" />
        <Text className="text-2xl font-bold text-gray-900 mt-4">Oops! Shop Unavailable</Text>
        <Text className="text-center text-gray-600 mt-2">
          We&apos;re making some improvements. Please check back later or contact support for help.
        </Text>
        <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-full mt-4">
          <Text className="text-white font-semibold">Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

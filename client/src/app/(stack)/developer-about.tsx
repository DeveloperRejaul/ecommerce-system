import { Image, ScrollView, Text, View } from 'react-native';
import React from 'react';
import Developer from '@/src/core/assets/images/developer.jpeg';

export default function DeveloperAbout() {
  return (
    <ScrollView contentContainerClassName="container px-5 pt-20 items-center" showsVerticalScrollIndicator={false}>
      <Image
        source={Developer}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text className="text-2xl font-bold mt-5">Rezaul Karim</Text>
      <Text className="text-sm text-gray-600">Software Engineer | Founder of Aptinity</Text>
      <View className="mt-5">
        <Text className="text-base text-gray-800">
          I am Rezaul Karim, a passionate Software Engineer specializing in mobile and web application development. With expertise in React Native, Flutter, and modern web technologies, I focus on building high-performance, scalable, and user-friendly digital solutions.
        </Text>
        <Text className="text-base text-gray-800 mt-2">
          Currently, I work as a Software Engineer at OrangeToolz, where I develop and optimize cutting-edge applications to enhance user experiences. Additionally, I am the founder of Aptinity, a technology company dedicated to delivering top-notch eCommerce solutions, including mobile apps, web platforms, and admin dashboards for businesses of all sizes.
        </Text>
        <Text className="text-base text-gray-800 mt-2">
          At Aptinity, our mission is to transform the eCommerce landscape by providing innovative, efficient, and tailored digital solutions. Whether you&apos;re launching a new online store or scaling an existing business, we ensure seamless integration and exceptional user experience.
        </Text>
        <Text className="text-base text-gray-800 mt-2">
          📍 Location: Dhaka, Bangladesh
        </Text>
        <Text className="text-base text-gray-800 mt-2">
          🚀 Founder: Aptinity – Powering the Future of eCommerce
        </Text>
      </View>
    </ScrollView>
  );
}

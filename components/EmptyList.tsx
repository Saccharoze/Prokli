import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';

import { images } from '../constants';
import Button from './Button';

// Shown in place of an empty list, with a shortcut to the challenges.
export default function EmptyList({ message, hint }: { message: string; hint?: string }) {
  return (
    <View className="items-center px-4">
      <Image source={images.empty} className="w-[270px] h-[215px]" resizeMode="contain" />
      <Text className="font-body-semibold text-black mt-2">{message}</Text>
      {hint ? <Text className="font-body-medium text-sm text-gray-400">{hint}</Text> : null}
      <Button label="FAITES UN DEFI" onPress={() => router.push('/defi')} className="w-full my-5" />
    </View>
  );
}

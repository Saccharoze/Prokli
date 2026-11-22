import { Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import GradientBackground from '../components/GradientBackground';
import { images } from '../constants';
import { useSession } from '../context/SessionProvider';

// First screen. A player with a session goes straight to the home feed.
export default function Welcome() {
  const { status } = useSession();
  if (status === 'in') return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-white h-full p-5">
      <GradientBackground colors={['#FCABA6', '#F99FFA', '#FFFFFF']} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="items-center px-5">
          <Image source={images.icon} className="w-[100px] h-[100px] mb-10" resizeMode="contain" />
          <Text className="font-bold text-3xl text-black">Lance toi un défi ?</Text>
          <Image source={images.prokli} className="w-[240px] h-[70px] -mt-3 mb-3" resizeMode="contain" />
          <Text className="font-display text-sm text-gray-700 text-center p-1">
            VIENS TE METTRE DANS UN{'\n'}TRAQUENARD PAS POSSIBLE !
          </Text>
          <Button label="CONTINUE AVEC TON EMAIL" onPress={() => router.push('/sign-in')} className="w-full mt-7" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

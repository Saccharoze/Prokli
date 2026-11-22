import { View, FlatList, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PartenaireCard from '../components/PartenaireCard';
import GradientBackground from '../components/GradientBackground';
import { images, PARTNERS } from '../constants';

// The partner places, opened from "NOS PARTENAIRES" on the Défis tab.
const Partenaire = () => (
  <View>
    <GradientBackground colors={['#DDCFFF', '#D49FFA', '#FFFFFF']} />
    <FlatList
      data={PARTNERS}
      keyExtractor={(item) => item.label}
      renderItem={({ item }) => (
        <View className="p-0 flex items-center shadow-2xl">
          <PartenaireCard partner={item} />
          <ImageBackground className="w-[80px] h-[80px]" source={images.blob} />
        </View>
      )}
      ListHeaderComponent={() => (
        <SafeAreaView className="flex-row justify-center">
          <ImageBackground className="w-[80px] h-[80px]" source={images.blob} />
        </SafeAreaView>
      )}
    />
  </View>
);

export default Partenaire;

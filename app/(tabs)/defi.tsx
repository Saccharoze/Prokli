import { View, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategorieCard from '../../components/CategorieCard';
import GradientBackground from '../../components/GradientBackground';
import { CATEGORIES } from '../../constants';

// Défis tab: the challenge categories.
const Defi = () => (
  <View>
    <GradientBackground colors={['#FCABA6', '#D49FFA', '#FFFFFF']} />
    <FlatList
      data={CATEGORIES}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <View className="flex items-center justify-center shadow-2xl py-5">
          <CategorieCard category={item} />
        </View>
      )}
      ListHeaderComponent={() => (
        <SafeAreaView className="flex-row justify-center">
          <Text className="font-display text-6xl p-10">DEFIS</Text>
        </SafeAreaView>
      )}
    />
  </View>
);

export default Defi;

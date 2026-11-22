import { TouchableOpacity, Text, View } from 'react-native';
import { router } from 'expo-router';

import { cardShadow } from '../constants';

type Props = { category: { key: string; label: string } };

// One button of the Défis tab: opens the partner list or a category's challenges.
const CategorieCard = ({ category }: Props) => {
  const isPartners = category.key === 'partenaires';
  const open = () => router.push(isPartners ? '/partenaire' : `/category/${category.key}`);

  return (
    <TouchableOpacity
      className="bg-white rounded-xl min-h-[62px] flex-row justify-center items-center"
      style={cardShadow}
      onPress={open}
      activeOpacity={0.7}
    >
      <View className="flex-col items-center justify-between h-[80px] w-[90%] p-5">
        <Text className={`font-display text-3xl p-1 text-center ${isPartners ? 'text-lilac' : 'text-ink'}`}>
          {category.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategorieCard;

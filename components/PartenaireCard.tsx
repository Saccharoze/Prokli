import { TouchableOpacity, Text, View } from 'react-native';
import { router } from 'expo-router';

import { cardShadow } from '../constants';

type Props = { partner: { key?: string; label: string } };

// A partner place. Partners with a key open their own challenge category.
const PartenaireCard = ({ partner }: Props) => (
  <TouchableOpacity
    className="bg-white rounded-xl min-h-[62px] flex-row justify-center items-center"
    style={cardShadow}
    onPress={partner.key ? () => router.push(`/category/${partner.key}`) : undefined}
    disabled={!partner.key}
    activeOpacity={0.7}
  >
    <View className="flex items-center justify-center h-[200px] w-[90%] p-5">
      <Text className="text-ink font-display text-3xl p-1 text-center">{partner.label}</Text>
    </View>
  </TouchableOpacity>
);

export default PartenaireCard;

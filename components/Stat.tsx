import { Text, View } from 'react-native';

// A number with its label under it ("12 / Posts").
export default function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View className="items-center mx-5">
      <Text className="font-body-semibold text-xl text-ink">{value}</Text>
      <Text className="font-body text-sm text-ink">{label}</Text>
    </View>
  );
}

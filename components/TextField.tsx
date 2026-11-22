import { useState } from 'react';
import { Pressable, Text, TextInput, View, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  // hides the text, with an eye button to show it
  secret?: boolean;
  keyboardType?: KeyboardTypeOptions;
  className?: string;
};

export default function TextField({ label, value, onChangeText, secret = false, keyboardType, className = '' }: Props) {
  const [hidden, setHidden] = useState(secret);

  return (
    <View className={className}>
      <Text className="font-display text-base text-gray-800 mb-2">{label}</Text>
      <View className="flex-row items-center h-16 px-4 rounded-2xl border-2 border-black">
        <TextInput
          className="flex-1 font-body-semibold text-base text-black"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {secret && (
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={8}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={26} color="#555555" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

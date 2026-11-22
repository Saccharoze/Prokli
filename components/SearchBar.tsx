import { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

// Searches the posted photos by challenge title; opens /search/<text>.
export default function SearchBar({ initial = '' }: { initial?: string }) {
  const [text, setText] = useState(initial);
  const onSearchScreen = usePathname().startsWith('/search');

  const submit = () => {
    const query = text.trim();
    if (!query) return Alert.alert('Requête manquante', 'Par pitié recherchez un truc ^^');
    if (onSearchScreen) router.setParams({ query });
    else router.push({ pathname: '/search/[query]', params: { query } });
  };

  return (
    <View className="flex-row items-center h-16 px-4 rounded-2xl border-2 border-ink">
      <TextInput
        className="flex-1 font-body text-base text-black"
        value={text}
        onChangeText={setText}
        onSubmitEditing={submit}
        placeholder="Recherche les DEFIS"
        placeholderTextColor="#555555"
        returnKeyType="search"
      />
      <Pressable onPress={submit} hitSlop={8}>
        <Ionicons name="search" size={20} color="#555555" />
      </Pressable>
    </View>
  );
}

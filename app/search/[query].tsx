import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import EmptyList from '../../components/EmptyList';
import GradientBackground from '../../components/GradientBackground';
import PostList from '../../components/PostList';
import SearchBar from '../../components/SearchBar';
import { searchPosts } from '../../lib/appwrite';
import useQuery from '../../lib/useQuery';

// Photos whose challenge title matches the search; runs again when the query changes.
export default function Search() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const results = useQuery(() => searchPosts(query), [query]);

  return (
    <SafeAreaView className="bg-white h-full">
      <GradientBackground colors={['#CC59D2', '#FFFFFF']} />
      <PostList
        posts={results.data}
        header={
          <View className="my-6 px-4">
            <Text className="font-body-medium text-sm text-ink">Résultat de la recherche</Text>
            <Text className="font-body-semibold text-sm text-black mb-6">{query}</Text>
            <View className="mb-8">
              <SearchBar initial={query} />
            </View>
          </View>
        }
        empty={<EmptyList message="Aucun défi trouvé pour cette recherche" />}
      />
    </SafeAreaView>
  );
}

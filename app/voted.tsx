import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import EmptyList from '../components/EmptyList';
import GradientBackground from '../components/GradientBackground';
import Poll from '../components/Poll';
import PostList from '../components/PostList';
import SearchBar from '../components/SearchBar';
import { getVotedPosts } from '../lib/appwrite';
import useQuery from '../lib/useQuery';
import { useSession } from '../context/SessionProvider';

// The photos the player voted on, with their current counts.
export default function Voted() {
  const { player } = useSession();
  const voted = useQuery(() => (player ? getVotedPosts(player.$id) : []), [player?.$id]);

  return (
    <SafeAreaView className="bg-white h-full">
      <GradientBackground colors={['#DDBFFF', '#FFFFFF']} />
      <PostList
        posts={voted.data}
        gap={40}
        itemClassName="px-4 bg-white border-2 border-gray-100 rounded-2xl"
        below={(post) => <Poll poll={post} mode="results" />}
        onRefresh={voted.reload}
        header={
          <View className="my-6 px-4">
            <Text className="font-body-medium text-sm text-ink">Vos votes</Text>
            <Text className="font-body-semibold text-black mb-6">{player?.username}</Text>
            <SearchBar />
            <Pressable onPress={() => router.push('/home')} className="self-end pt-2 pb-5">
              <Text className="font-display text-lg text-black p-1">ALLEZ VOTER</Text>
            </Pressable>
          </View>
        }
        empty={<EmptyList message="Aucun vote pour l'instant" hint="Allez voter sur l'accueil" />}
      />
    </SafeAreaView>
  );
}

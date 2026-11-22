import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import EmptyList from '../../components/EmptyList';
import GradientBackground from '../../components/GradientBackground';
import Poll from '../../components/Poll';
import PostList from '../../components/PostList';
import SearchBar from '../../components/SearchBar';
import { closeExpiredVotes, getNotVotedPosts } from '../../lib/appwrite';
import useQuery from '../../lib/useQuery';
import { useSession } from '../../context/SessionProvider';

// Home feed: the latest photos the player hasn't voted on, each with its vote buttons.
// Pulling down first closes the votes that are over (see closeExpiredVotes).
export default function Home() {
  const { player } = useSession();
  const feed = useQuery(() => (player ? getNotVotedPosts(player.$id) : []), [player?.$id]);

  if (!player) return null;

  return (
    <SafeAreaView className="bg-white h-full">
      <GradientBackground colors={['#DDBFFF', '#FFFFFF']} />
      <PostList
        posts={feed.data}
        reporterId={player.$id}
        below={(post) => <Poll poll={post} mode="vote" />}
        onRefresh={async () => {
          await closeExpiredVotes().catch(() => {});
          await feed.reload();
        }}
        header={
          <View className="my-6 px-4">
            <Text className="font-body-medium text-sm text-ink">Bienvenue</Text>
            <Text className="font-body-semibold text-black mb-6">{player.username}</Text>
            <SearchBar />
            <Pressable onPress={() => router.push('/voted')} className="self-end pt-5">
              <Text className="font-display text-lg text-black mb-3 p-1">VOS VOTES</Text>
            </Pressable>
          </View>
        }
        empty={<EmptyList message="Aucun défi trouvé" hint="Soyez le premier à réaliser un défi" />}
      />
    </SafeAreaView>
  );
}

import { Alert, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import EmptyList from '../../components/EmptyList';
import GradientBackground from '../../components/GradientBackground';
import PostList from '../../components/PostList';
import Stat from '../../components/Stat';
import { getUserPosts, updateAvatar } from '../../lib/appwrite';
import useQuery from '../../lib/useQuery';
import { useSession } from '../../context/SessionProvider';

// Profile tab: avatar (tap to change it), points, and the player's accepted photos.
export default function Profile() {
  const { player, refresh, signOut } = useSession();
  const posts = useQuery(() => (player ? getUserPosts(player.$id) : []), [player?.$id]);

  const leave = async () => {
    await signOut();
    if (router.canDismiss()) router.dismissAll();
    else router.replace('/sign-in');
  };

  const pickAvatar = async () => {
    const picked = await DocumentPicker.getDocumentAsync({
      type: ['image/png', 'image/jpg', 'image/jpeg', 'image/heif', 'image/heic'],
    });
    if (picked.canceled) return;
    try {
      await updateAvatar(player.$id, picked.assets[0].uri);
      await refresh();
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  if (!player) return null;

  return (
    <SafeAreaView className="h-full bg-white">
      <GradientBackground colors={['#DDBFFF', '#FFFFFF']} />
      <PostList
        posts={posts.data}
        gap={90}
        onRefresh={() => Promise.all([refresh(), posts.reload()])}
        header={
          <View className="items-center mt-6 mb-12 px-4">
            <Pressable onPress={leave} className="self-end mb-10" hitSlop={8}>
              <Ionicons name="log-out-outline" size={28} color="#000000" />
            </Pressable>
            <Pressable onPress={pickAvatar} className="w-16 h-16 rounded-lg border border-ink overflow-hidden">
              <Image source={{ uri: player.avatar }} className="w-full h-full" resizeMode="cover" />
            </Pressable>
            <Text className="font-body-semibold text-lg text-ink mt-5">{player.username}</Text>
            <View className="flex-row mt-5">
              <Stat value={posts.data.length} label="Posts" />
              <Stat value={player.points} label="Points" />
            </View>
          </View>
        }
        empty={<EmptyList message="Aucun défi réalisé" hint="Réalisez votre premier défi !" />}
      />
    </SafeAreaView>
  );
}

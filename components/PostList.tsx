import { ReactElement, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import PostCard from './PostCard';

export type Post = { $id: string; title: string; photo: string; valide: number; refuse: number };

type Props = {
  posts: Post[];
  header: ReactElement;
  empty: ReactElement;
  // pull-to-refresh, when given
  onRefresh?: () => Promise<unknown>;
  // the signed-in player, to show the report button
  reporterId?: string;
  // drawn under each photo (vote buttons, counts)
  below?: (post: Post) => ReactElement;
  itemClassName?: string;
  gap?: number;
};

// The photo feeds: home, the player's votes, the profile and the search results.
export default function PostList({
  posts,
  header,
  empty,
  onRefresh,
  reporterId,
  below,
  itemClassName = 'px-4',
  gap = 0,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await onRefresh?.();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(post) => post.$id}
      renderItem={({ item }) => (
        <View className={itemClassName}>
          <PostCard post={item} userId={reporterId} />
          {below?.(item)}
        </View>
      )}
      ItemSeparatorComponent={gap ? () => <View style={{ height: gap }} /> : undefined}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={refresh} /> : undefined}
    />
  );
}

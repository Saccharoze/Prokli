import { useCallback, useEffect, useState } from 'react';
import { View, FlatList, ImageBackground, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';

import DefiCard from '../../components/DefiCard';
import GradientBackground from '../../components/GradientBackground';
import { images } from '../../constants';
import { getOpenChallenges } from '../../lib/appwrite';
import useQuery from '../../lib/useQuery';
import { useSession } from '../../context/SessionProvider';

// The challenges of one category (/category/sport, /category/parc-test...) that the user hasn't done yet.
// `name` is the value of the `categorie` field in the defis collection.
const Category = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { player } = useSession();
  const { data: defis, reload } = useQuery(
    () => (player ? getOpenChallenges(player.$id, name) : []),
    [player?.$id, name],
  );
  const [loading, setLoading] = useState(true);

  const fade = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      fade.value = withTiming(0, { duration: 200, easing: Easing.inOut(Easing.ease) });
      const timer = setTimeout(() => {
        setLoading(false);
        fade.value = withTiming(1, { duration: 700, easing: Easing.ease });
      }, 1000);
      return () => {
        clearTimeout(timer);
        reload();
      };
      // runs on each focus only: reload and the animations are not dependencies
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // Cards sway left and right, every other one in the opposite direction.
  const offsetX = useSharedValue(3);
  const offsetY = useSharedValue(2);
  const swayRight = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));
  const swayLeft = useAnimatedStyle(() => ({
    transform: [{ translateX: -offsetX.value }, { translateY: offsetY.value }],
  }));

  useEffect(() => {
    offsetX.value = withRepeat(withTiming(-offsetX.value, { duration: 4000 }), -1, true);
    offsetY.value = withRepeat(withTiming(-offsetY.value, { duration: 1000 }), -1, true);
  }, [offsetX, offsetY]);

  return (
    <View style={{ flex: 1 }}>
      <GradientBackground colors={['#DDCFFF', '#D49FFA', '#FFFFFF']} />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fade }}>
          <FlatList
            data={defis}
            keyExtractor={(item) => item.$id}
            renderItem={({ item, index }) => (
              <View className="p-0 flex items-center shadow-2xl">
                <Animated.View style={index % 2 === 0 ? swayRight : swayLeft}>
                  <DefiCard defi={item} userId={player.$id} />
                </Animated.View>
                <ImageBackground className="w-[80px] h-[80px]" source={images.blob} />
              </View>
            )}
            ListHeaderComponent={() => (
              <SafeAreaView className="flex-row justify-center">
                <ImageBackground className="w-[80px] h-[80px]" source={images.blob} />
              </SafeAreaView>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

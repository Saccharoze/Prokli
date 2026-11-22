import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Text,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';

import UserCard from '../../components/UserCard';
import GradientBackground from '../../components/GradientBackground';
import { images, teamByKey } from '../../constants';
import { getAllUsers, getTeamRanking } from '../../lib/appwrite';
import useQuery from '../../lib/useQuery';
import { useSession } from '../../context/SessionProvider';

// Leaderboard tab: the three teams on a podium, then every user by points.
// A user without a team is first sent to the team roulette.
const Classement = () => {
  const { player, refresh } = useSession();
  const { data: users, reload: reloadUsers } = useQuery(getAllUsers);
  const { data: ranking, loading: rankingLoading, reload: reloadRanking } = useQuery(getTeamRanking);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fade = useSharedValue(1);
  const fadeIn = () => (fade.value = withTiming(1, { duration: 400, easing: Easing.ease }));
  const fadeOut = () => (fade.value = 0);

  // Reload the player on focus: coming back from the roulette, player.team is now set.
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      refresh();
      fadeOut();
      const timer = setTimeout(() => {
        fadeIn();
        setLoading(false);
      }, 500);
      return () => {
        clearTimeout(timer);
        reloadUsers();
      };
      // runs on each focus only: refetch and the animations are not dependencies
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    fadeOut();
    await Promise.all([reloadUsers(), reloadRanking()]);
    setRefreshing(false);
    fadeIn();
  };

  // Rows sway left and right; the podium icons pulse, rotate and slide.
  const offsetX = useSharedValue(3);
  const offsetY = useSharedValue(1);
  const rotation = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    offsetX.value = withRepeat(withTiming(-offsetX.value, { duration: 4000 }), -1, true);
    offsetY.value = withRepeat(withTiming(-offsetY.value, { duration: 1000 }), -1, true);
    rotation.value = withRepeat(withTiming(7, { duration: 2000 }), -1, true);
    scale.value = withRepeat(withTiming(0.96, { duration: 3000 }), -1, true);
  }, [offsetX, offsetY, rotation, scale]);

  const swayRight = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));
  const swayLeft = useAnimatedStyle(() => ({
    transform: [{ translateX: -offsetX.value }, { translateY: offsetY.value }],
  }));
  const firstStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const secondStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const thirdStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -offsetX.value }] }));

  if (!player) return null;

  const teamImage = (place: number) => teamByKey(ranking[place]?.team)?.image;

  return (
    <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      <GradientBackground colors={['#FF7E77', '#FFFFFF']} />

      {loading || refreshing || rankingLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : !player.team ? (
        <Modal animationType="slide" transparent onRequestClose={() => router.push('/home')}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <GradientBackground colors={['#FF7E77', '#FFFFFF']} style={{ borderRadius: 20 }} />
              <Text style={styles.modalText}>Découvrez votre équipe pour accéder au classement !</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: 'rgba(255, 159, 159, 0.9)', marginRight: 15 }]}
                  onPress={() => router.push('/team')}
                >
                  <Text style={styles.buttonText}>CONTINUER</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: 'rgba(0, 0, 0, 0.9)', marginLeft: 15 }]}
                  onPress={() => router.push('/home')}
                >
                  <Text style={styles.buttonText}>Partir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fade }}>
          <FlatList
            data={users}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            keyExtractor={(item) => item.$id}
            renderItem={({ item, index }) => (
              <View className="px-4">
                <Animated.View style={index % 2 === 0 ? swayRight : swayLeft}>
                  <UserCard user={item} rank={index} />
                </Animated.View>
              </View>
            )}
            ListHeaderComponent={() => (
              // ranking is sorted lowest first: [2] is the leading team, on the middle step
              <View style={{ bottom: '-20%' }}>
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                  <Image className="w-[900px] h-auto" source={images.pedestal} />
                </View>
                <View style={{ position: 'relative', top: '-3%', left: '36%' }}>
                  <Animated.View style={firstStyle}>
                    <Image className="w-[120px] h-[120px]" source={teamImage(2)} />
                  </Animated.View>
                </View>
                <View style={{ position: 'relative', top: '-18%', left: '55%' }}>
                  <Animated.View style={secondStyle}>
                    <Image className="w-[115px] h-[115px]" source={teamImage(1)} />
                  </Animated.View>
                </View>
                <View style={{ position: 'relative', top: '-35%', left: '17%' }}>
                  <Animated.View style={thirdStyle}>
                    <Image className="w-[105px] h-[105px]" source={teamImage(0)} />
                  </Animated.View>
                </View>
              </View>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default Classement;

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: { marginBottom: 30, textAlign: 'center', fontSize: 15 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { borderRadius: 10, padding: 10, paddingHorizontal: 20, elevation: 2 },
  buttonText: { padding: 10, color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, Easing } from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';

import GradientBackground from '../components/GradientBackground';
import { cardShadow, TEAMS } from '../constants';
import { setTeam } from '../lib/appwrite';
import { useSession } from '../context/SessionProvider';

const { width } = Dimensions.get('window');

// Team roulette, shown the first time a user opens the leaderboard: a strip of team logos
// spins and stops on a random team, which is saved on the user.
const Team = () => {
  const { player } = useSession();
  const [selected, setSelected] = useState<number | null>(null);
  const [chosen, setChosen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const translateX = useSharedValue(0);
  const strip = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const spin = () => {
    if (!isReady || selected !== null) return;
    const index = Math.floor(Math.random() * TEAMS.length);
    const target = -index * width;

    // three fast turns, a jump back to the same logo, then a slow stop on it
    translateX.value = withSequence(
      withTiming(target - TEAMS.length * width * 3, { duration: 4000, easing: Easing.out(Easing.ease) }),
      withTiming(target, { duration: 0 }),
      withTiming(target, { duration: 1000, easing: Easing.out(Easing.ease) }),
    );
    setSelected(index);
    setTimeout(async () => {
      await setTeam(player.$id, TEAMS[index].key);
      setChosen(true);
    }, 5500);
  };

  const team = selected === null ? null : TEAMS[selected];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(150, 109, 249, 0.8)', 'transparent']} style={styles.left} />
      <View style={styles.window}>
        <Animated.View style={[styles.strip, strip]}>
          {Array.from({ length: 33 }, (_, i) => (
            <Image key={i} source={TEAMS[i % TEAMS.length].image} style={styles.logo} />
          ))}
        </Animated.View>
      </View>
      <LinearGradient colors={['transparent', 'rgba(242, 200, 249, 0.8)']} style={styles.right} />

      {!isReady || (team && !chosen) ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : team ? (
        <Modal animationType="slide" transparent visible onRequestClose={() => router.back()}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <GradientBackground colors={[team.background, '#FFFFFF']} style={{ borderRadius: 20 }} />
              <Text style={styles.modalText}>Vous avez été choisis par l'équipe {team.key} !</Text>
              <TouchableOpacity style={[styles.button, { backgroundColor: team.button }]} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Suivant</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        <TouchableOpacity
          className="bg-white rounded-xl min-h-[62px] flex-row justify-center items-center"
          style={cardShadow}
          onPress={spin}
          activeOpacity={0.7}
        >
          <View className="flex-col items-center justify-between h-[80px] w-[90%] p-5">
            <Text className="font-display text-lg p-1 text-center text-lilac">ROULETTE !</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Team;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  window: { width, height: 200, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 200 },
  strip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(242, 109, 150, 0.8)' },
  logo: { width, height: 200, resizeMode: 'contain' },
  left: { position: 'absolute', left: 0, height: '100%', width: '50%' },
  right: { position: 'absolute', right: 0, height: '100%', width: '50%' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: { marginBottom: 30, textAlign: 'center', fontSize: 20 },
  button: { borderRadius: 10, padding: 10, margin: 10, elevation: 2 },
  buttonText: { padding: 10, color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

import { View, FlatList, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import DefiCard from '@/components/DefiCard';
import { useSegments } from 'expo-router';
import { images } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/lib/useAppwrite';
import { getNotMadeDefi } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing,
  } from 'react-native-reanimated';

const Sport = () => {
  const segments = useSegments();
  const isPlace = segments[1];
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: alldefis, refetch } = useAppwrite(() => getNotMadeDefi(user.$id, isPlace));

  const fadeAnim = useSharedValue(1); // Utilisation de useSharedValue

  const fadeIn = () => {
    fadeAnim.value = withTiming(1, {
      duration: 700,
      easing: Easing.ease,
    });
  };

  const fadeOut = () => {
    fadeAnim.value = withTiming(0, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  };

  useFocusEffect(
    useCallback(() => {
      fadeOut();
      setTimeout(() => {
        setLoading(false);
        fadeIn();
      }, 1000);
      return () => {
        refetch()
      };
    }, [])
  );

  const offset = useSharedValue(3);
  const offsetY = useSharedValue(2); // Initialisation de offsetY

  const animatedStyles1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value },
      { translateY: offsetY.value }, // Ajout de la transformation verticale
    ],
  }));

  const animatedStyles2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: -offset.value },
      { translateY: offsetY.value }, // Ajout de la transformation verticale
    ],
  }));

  React.useEffect(() => {
    
    offset.value = withRepeat(
      withTiming(-offset.value, { duration: 4000 }),
      -1,
      true
    );

    offsetY.value = withRepeat(
      withTiming(-offsetY.value, { duration: 1000 }),
      -1,
      true
    );
  }, []);

 

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#DDCFFF', '#D49FFA', '#FFFFFF']}
        style={styles.background}
      />
      {loading || refreshing ? (
        // Afficher l'animation de chargement pendant le chargement des données
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={alldefis}
          viewabilityConfig={{ itemVisiblePercentThreshold: 10 }}
          keyExtractor={(item) => item.$id}
          renderItem={({ item , index  }) => {
            if (index%2 === 0) {
              return (
                <View className="p-0 flex items-center shadow-2xl">
                  <Animated.View style={animatedStyles1}>
                  <DefiCard defi={item} userId={user.$id} />
                  </Animated.View>
                  <View className="flex-row justify-between">
                    <ImageBackground className="w-[80px] h-[80px] rounded-1xl" source={images.test} />
                  </View>
                </View>
              ) 
            } else return (
              <View className="p-0 flex items-center shadow-2xl">
                <Animated.View style={animatedStyles2}>
                <DefiCard defi={item} userId={user.$id} />
                </Animated.View>
                <View className="flex-row justify-between">
                  <ImageBackground className="w-[80px] h-[80px] rounded-1xl" source={images.test} />
                </View>
              </View>
            ) 
          }}
          ListHeaderComponent={() => (
            <SafeAreaView className="flex-row justify-center">
              <ImageBackground className="w-[80px] h-[80px] rounded-1xl" source={images.test} />
            </SafeAreaView>
          )}
        />
        </Animated.View>
      )}
    </View>
  );
};

export default Sport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
},
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

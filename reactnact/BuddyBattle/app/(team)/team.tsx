import { View , Text , StyleSheet , Image, Dimensions, TouchableOpacity, ActivityIndicator, Modal} from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient }from 'expo-linear-gradient'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router'
import { teamChosen } from '@/lib/appwrite'

const imageslist = [
  require('../../assets/images/team_soleil.png') ,
  require("../../assets/images/team_terre.png") ,
  require("../../assets/images/team_ocean.png")
];
const listTeam = [
  'montagne' , 'ocean' , 'soleil'
]
const listTeamColor = [
  'rgba(36, 83, 19, 0.9)' , 'rgba(43, 80, 170, 0.9)' , 'rgba(255, 159, 10, 0.9)'
]

const listTeamColorBg = [
  '#885313' , '#2B50AA' ,'#FF9F0A'
]


const { width } = Dimensions.get('window');

const Team = () => {
  
  const stylesModal = StyleSheet.create({
    
  })

  const { userId } = useLocalSearchParams();
  const [selectedIndex, setSelectedIndex ] = useState(null);
  const [chosen, setChosen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Simulate a loading process, set isReady to true once done
    setTimeout(() => {
      setIsReady(true);
    }, 1000); // Replace this with your actual loading logic
  }, []);

  const handleNext = () => {
    router.back();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const startRoulette = () => {
    if (!isReady) return; // Prevent action if not ready
    const totalWidth = imageslist.length * width * 3 ;
    const randomIndex = Math.floor(Math.random() * imageslist.length);
    const randomOffset = -(randomIndex * width);
    const endOffset = randomOffset - totalWidth;

    translateX.value = withSequence(
      withTiming(endOffset, {
        duration: 4000,
        easing: Easing.out(Easing.ease),
      }),
      withTiming(randomOffset, {
        duration: 0,
      }),
      withTiming(-randomIndex * width + width / 2 - width / 2, {
        duration: 1000,
        easing: Easing.out(Easing.ease),
      })
    );
    setSelectedIndex(randomIndex);
    setTimeout(() => { 
      setChosen(true); 
      if (randomIndex === 0) 
        teamChosen(userId, 'montagne');
      else if (randomIndex === 1) 
        teamChosen(userId, 'ocean');
      else if (randomIndex === 2) 
        teamChosen(userId, 'soleil');
    }, 5500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(150, 109, 249,0.8)', 'transparent']}
        style={styles.gradientLeft}
      />
      <View style={styles.rouletteContainer}>
        <Animated.View style={[styles.roulette, animatedStyle]}>
          {[...Array(33).keys()].map((_, i) => (
            <Image key={i} source={imageslist[i % imageslist.length]} style={styles.image} />
          ))}
        </Animated.View>
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(242, 200, 249,0.8)']}
        style={styles.gradientRight}
      />
      {!isReady ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : selectedIndex !== null && !chosen ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : chosen ? (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={chosen}
            onRequestClose={() => {
              setChosen(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <LinearGradient
                // Background Linear Gradient
                colors={[ listTeamColorBg[selectedIndex] , '#FFFFFF']}
                style={{position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: '100%' ,
                  borderRadius: 20
                }}
                />
                <Text style={styles.modalText}>Vous avez été choisis par l'équipe {listTeam[selectedIndex]} !</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button , {backgroundColor: listTeamColor[selectedIndex] , marginRight : 15 }]} onPress={handleNext}>
                    <Text style={styles.buttonText}>Suivant</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <TouchableOpacity
          className={`bg-white rounded-xl min-h-[62px] flex-row justify-center items-center`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 25 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 50
          }}
          onPress={startRoulette}
          activeOpacity={0.7}
        >
          <View className="flex-col items-center justify-between h-[80px] w-[90%] p-5">
            <Text style={{ color: '#D49FFA' }} className="font-dshadow text-lg p-1 text-center">ROULETTE !</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default Team


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rouletteContainer: {
    width: width,
    height: 200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:200,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  roulette: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 109, 150,0.8)'
  },
  image: {
    width: width,
    height: 200,
    resizeMode: 'contain',
  },
  gradientLeft: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: '50%',
  },
  gradientRight: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: '50%',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize : 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    padding : 10 ,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 2,
  },
});
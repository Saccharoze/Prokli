import { View, Image, FlatList, ImageBackground, Text, RefreshControl , StyleSheet, ActivityIndicator, Modal, TouchableOpacity} from 'react-native'
import React, { useCallback, useState } from 'react'

import {images} from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppwrite from '@/lib/useAppwrite'
import { getAllUsers, getCurrentUser, getRank } from '@/lib/appwrite'
import UserCard from '@/components/UserCard'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useFocusEffect } from 'expo-router'

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import Team from '../(team)/team'
import { useGlobalContext } from '@/context/GlobalProvider'
import CustomButton from '@/components/CustomButton'



const Bookmark = () => {

  const { user , setUser } = useGlobalContext() ;
  const {data: allusers, refetch} = useAppwrite(getAllUsers) ;
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true);
  const {data : rankInt , isLoading ,refetch : fetchRankData} = useAppwrite(getRank) ;
 
  const fetchUserData = async () => {
    // Remplacez cette fonction par la logique nécessaire pour obtenir les données utilisateur
    const updatedUser = await getCurrentUser(); // Exemple de fonction pour obtenir les données
    setUser(updatedUser);
  };

  
 
  const handleAccept = () => {
    router.setParams({user})
    router.push({pathname : '(team)/team' , params: {userId :user.$id}})
  };

  const handleReject = () => {
    router.push('/home')
  };

  

  const fadeAnim = useSharedValue(1); // Utilisation de useSharedValue

  const onRefresh = async () => {
    setRefreshing(true) ;
    fadeOut();
    await refetch();
    await fetchRankData() ;
    setRefreshing(false) ;
    fadeIn()
  }


  const fadeIn = () => {
    fadeAnim.value = withTiming(1, {
      duration: 400,
      easing: Easing.ease,
    });
  };

  const fadeOut = () => {
    fadeAnim.value = withTiming(0, {
      duration: 0,
      easing: Easing.inOut(Easing.ease),
    });
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      fetchUserData()
      fadeOut();
      setTimeout(() => {
        
        fadeIn();
        setLoading(false);
      }, 500);
      return () => {
        refetch()
        setLoading(true)
      };
    }, [])
  );


  const offset = useSharedValue(3);
  const offsetY = useSharedValue(1); // Initialisation de offsetY
  const rotateValue = useSharedValue(1);
  const scaleValue = useSharedValue(1);

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

  const animatedStylesSoleil = useAnimatedStyle(() => ({
    transform: [
      { scale: scaleValue.value },
    ],
  }));

  const animatedStylesTerre = useAnimatedStyle(() => ({
    transform: [
      { translateX: -offset.value },
    ],
  }));

  const animatedStylesEau = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateValue.value}deg` },
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

    rotateValue.value = withRepeat(
      withTiming(7, { duration: 2000 }) , 
      -1 , 
      true);

    scaleValue.value = withRepeat(
      withTiming(0.96, { duration: 3000 }, () => {
        scaleValue.value = withRepeat(withTiming(1, { duration: 3000 }) , -1 , true);
    }),
    -1 ,
    true);


  }, []);
  if (user === null) return ; 
  return (
    <View  style={{backgroundColor:"#FFFFFF" , flex:1}}>
    <LinearGradient
        // Background Linear Gradient
        colors={[ '#FF7E77' , '#FFFFFF']}
        style={{position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%'}}
        />

    {loading || refreshing || isLoading  ? (
        // Afficher l'animation de chargement pendant le chargement des données
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : user.team === null ? (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            
            
          >
            <View style={styles.centeredView}>
            
              <View style={styles.modalView}>
              <LinearGradient
                // Background Linear Gradient
                colors={[ '#FF7E77' , '#FFFFFF']}
                style={{position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: '100%' ,
                  borderRadius: 20
                }}
                />
                <Text style={styles.modalText}>Découvrez votre équipe pour accéder au classement !</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button , {backgroundColor: 'rgba(255, 159, 159, 0.9)' , marginRight : 15 }]} onPress={handleAccept}>
                    <Text style={styles.buttonText}>CONTINUER</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button , {backgroundColor: 'rgba(0,0,0, 0.9)' , marginLeft : 15 }]} onPress={handleReject}>
                    <Text style={styles.buttonText}>    Partir   </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

      ) : (

    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>    
    <FlatList
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        data={allusers}
        //data={[]}
        viewabilityConfig={{
          itemVisiblePercentThreshold:10
        }}
        
        keyExtractor={(item) => item.$id}
        renderItem={({ item, index }) => {
        if (index%2 === 0) {
          return (
            <View className="px-4">
              <Animated.View style={animatedStyles1}>
                <UserCard users={item} rank={index} />
              </Animated.View>
            </View>
          )
        } else {
          return (
            <View className="px-4">
              <Animated.View style={animatedStyles2}>
                <UserCard users={item} rank={index} />
              </Animated.View>
            </View>
          )
        }
    }}
    ListHeaderComponent = {() => (
        <View>
        <View className="mt-0" style={{bottom:'-20%'}}>
        
        <View style={{flex:1 ,position:'absolute' , justifyContent:'center' , alignItems:'center'}}>
        <Image className="w-[900px] h-auto" source={images.pedestal} />
        </View>
          
          <View style={{position : 'relative' ,top:'-3%' , left:'36%'}}>
          <Animated.View style={animatedStylesEau}>
            <Image className="w-[120px] h-[120px]" 
            source={rankInt[2][1]} 
           
            />
          </Animated.View>
          </View>
          
          <View style={{position : 'relative'  , top:'-18%' , left:'55%'}}>
          <Animated.View style={animatedStylesSoleil}>
            <Image className="w-[115px] h-[115px]" 
            source={rankInt[1][1]} 
            style={{}}
            />
          </Animated.View>
          </View>

          <View style={{position : 'relative' , top:'-35%' , left:'17%'}}>
          <Animated.View style={animatedStylesTerre}>
            <Image className="w-[105px] h-[105px]" 
            source={rankInt[0][1]} 
            style={{}}
            />
          </Animated.View>
          </View>
        
        </View>
        
        </View>
      )}
      refreshControl={<RefreshControl refreshing = {refreshing} onRefresh={onRefresh} />}

    />
    </Animated.View>
    )}

    
    </View>
  )
}

export default Bookmark

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
    borderRadius: 10,
    padding: 10,
    paddingHorizontal : 20 ,
    elevation: 2,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
  loaderContainer: {
    flex: 1 ,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 30,
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
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize : 15
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
});
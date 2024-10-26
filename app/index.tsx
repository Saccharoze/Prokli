import { StatusBar } from 'expo-status-bar';
import { Text, Image , View ,ScrollView ,StyleSheet } from 'react-native';
import { Link , Redirect , router, useSegments } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {images} from '../constants'
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';
import { LinearGradient } from 'expo-linear-gradient';


export default function App() {

  const {isLoading , isLoggedIn} = useGlobalContext() ;

  if (!isLoading && isLoggedIn) return <Redirect href="/home"/>

 
  
  return (
    <SafeAreaView className="bg-white h-full p-5">
      <LinearGradient
        // Background Linear Gradient
        colors={[ '#FCABA6' ,'#F99FFA' ,  '#FFFFFF']}
        style={{position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%'}}
        />
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="w-full flex justify-center items-center px-5 min-h-[85vh]">
          <Image 
            source={images.icon} 
            className="w-[100px] h-[100px] relative -top-10 mb-10"
            resizeMode='contain'
          />

          

          <View className="flex justify-center align-middle">
            <Text className="text-3xl text-black font-bold">
                Lance toi un défi ?           
            </Text>  
          </View>
          <Image 
              source={images.prokli} 
              className="w-fit h-[70px] -mt-3 mb-3"
              resizeMode='contain'
            /> 


         
          <Text className="text-sm font-dshadow text-gray-700 text-center " style={{padding:5,}}>
              VIENS TE METTRE DANS UN 
          </Text>
          <Text className="text-sm font-dshadow text-gray-700 text-center " style={{padding:5,}}>
              TRAQUENAR PAS POSSIBLE !
          </Text>
          <CustomButton 
            title="CONTINUE AVEC TON EMAIL"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
                        
          />

            
        </View>
      </ScrollView>

      
    </SafeAreaView >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 18,
  },
  largeText: {
    fontSize: 24,
  },
  imageContainer : {
    width : 250 ,
    height : 35 ,
  }
});




import { TouchableOpacity , Text, StyleSheet, ImageBackground , Image} from 'react-native'
import React from 'react'
import { View } from 'react-native-animatable';
import { router } from 'expo-router';
import {images} from '../constants'

const PartenaireCard = ({categorie} : {categorie : any}) => {
    
    //console.log(defi)

    const submit = () => {
     
        
      if (categorie ==='SHERWOOD PARC')
        router.push('(part)/sherwood')
      if (categorie ==='MUSEE')
        router.push('(part)/musee')
    
    }
      

    return (
      <View>
      <TouchableOpacity 
      className={`bg-white rounded-xl min-h-[62px] flex-row justify-center items-center 
                  `}
      style={{
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation:50
      }}
      onPress={submit}
      activeOpacity={0.7}
      >
      {categorie === 'SHERWOOD PARC' ? (
        <View className="flex items-center justify-center  h-[200px] w-[90%] p-5">
            <Image className="h-[100%] w-[120%]" source={images.sherwood} resizeMode='contain' />
            
        </View>
        ) : categorie === 'MUSEE' ? (
          <View className="flex items-center justify-center  h-[200px] w-[90%] p-5">
            <Image className="h-[100%] w-[120%]" source={images.perpignan} resizeMode='contain' />
            
        </View>
        ) : (
          <View className="flex items-center justify-center  h-[200px] w-[90%] p-5">
            <ImageBackground source={{}} />
            <Text className="text-primary font-dshadow text-3xl p-1 text-center">{categorie}</Text>
            
        </View>

        )}
      </TouchableOpacity>

      

      </View>
    )
  
}

export default PartenaireCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 250,
    marginLeft: -50
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  background: {
    position: 'absolute',
    height: '100%',
    width:'100%'
  },
});
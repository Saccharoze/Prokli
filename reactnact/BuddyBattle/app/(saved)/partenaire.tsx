import { View , FlatList, ImageBackground , StyleSheet} from 'react-native'
import React from 'react'
import DefiCard from '@/components/DefiCard'

import {images} from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient }from 'expo-linear-gradient'
import { ID } from 'react-native-appwrite'
import PartenaireCard from '@/components/PartenaireCard'

const Partenaire = () => {

   
    const data = [
        { id: ID.unique(), categorie: 'SHERWOOD PARC' }, 
        { id: ID.unique(), categorie: 'MUSEE' }, 
        { id: ID.unique(), categorie: 'AQUARIUM' },
        { id: ID.unique(), categorie: 'CAMPING' } ,
        { id: ID.unique(), categorie: 'PARC D\'ATTRACTION' } ,
    ];
   
    
    //console.log(alldefis)
    //console.log(user.$id)

  return (
    

    
    <View>
        <LinearGradient
        // Background Linear Gradient
        colors={[ '#DDCFFF' ,'#D49FFA' ,  '#FFFFFF']}
        style={styles.background}
        />
    <FlatList
        
        data={data}
        //data={[]}
        viewabilityConfig={{
          itemVisiblePercentThreshold:10
        }}

        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View className="p-0 flex items-center shadow-2xl">
            <PartenaireCard categorie={item.categorie}/>
            <View className="flex-row justify-between">
                <ImageBackground className="w-[80px] h-[80px] rounded-1xl" source={images.test} />  
            </View>
            
          </View>
    
  )}
    ListHeaderComponent = {() => (
        <SafeAreaView className="flex-row justify-center">
        
        <ImageBackground className="w-[80px] h-[80px] rounded-1xl" source={images.test} />
        
        
        {/*<Video
            className="w-full h-80 rounded-1xl"
            source={images.test}
            repeat={true} // Ajoutez cette ligne pour jouer la vidéo en boucle
            shouldPlay // Pour jouer la vidéo dès le départ
            isLooping // Pour jouer la vidéo en boucle
            resizeMode="cover" // Mode de redimensionnement de la vidéo
            isMuted
        /> */}

        </SafeAreaView>
      )}
    />
    </View>
  )
}

export default Partenaire

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
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
});
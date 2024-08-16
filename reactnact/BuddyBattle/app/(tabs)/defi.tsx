import { View , FlatList, Text , StyleSheet} from 'react-native'
import React, { useState } from 'react'
import CategorieCard from '@/components/CategorieCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import { LinearGradient }from 'expo-linear-gradient'
import { ID } from 'react-native-appwrite'

const Defi = () => {

    const { user } = useGlobalContext() ;
    const [refreshing, setRefreshing] = useState(false) ;
    
    const data = [
        { id: ID.unique(), categorie: 'NOS PARTENAIRE' }, 
        { id: ID.unique(), categorie: 'SPORT' }, 
        { id: ID.unique(), categorie: 'BOUFFE' },
        { id: ID.unique(), categorie: 'ADRENALINE' } ,
    ];
   
    
    

  return (
    

    
    <View>
        <LinearGradient
        // Background Linear Gradient
        colors={[ '#FCABA6' ,'#D49FFA' ,  '#FFFFFF']}
        style={styles.background}
        />
    <FlatList
        data={data}
        //data={[]}
        viewabilityConfig={{
        itemVisiblePercentThreshold:10
        }}
        
        ItemSeparatorComponent={() => <View style={{height: 0}} />}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
            <View className="
                flex
                items-center
                justify-center
                align-middle 
                shadow-2xl
                py-5">
                
                <CategorieCard categorie={item.categorie} />

            </View>
            
        )}
        
        

    ListHeaderComponent = {() => (
        <SafeAreaView className="flex-row justify-center">
            
        <Text className="font-dshadow text-6xl p-10">DEFIS</Text>
        
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

export default Defi

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
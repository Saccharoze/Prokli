import { TouchableOpacity , Text, StyleSheet} from 'react-native'
import React from 'react'
import { View } from 'react-native-animatable';
import { router } from 'expo-router';
import { teamChosen } from '@/lib/appwrite';

const CategorieCard = ({categorie} : {categorie : any}) => {
    
    //console.log(defi)

    const submit = () => {
      if (categorie === 'NOS PARTENAIRE')
        router.push('(saved)/partenaire')
      else if (categorie ==='SPORT')
        router.push('(saved)/sport')
      else if (categorie ==='BOUFFE')
        router.push('(saved)/bouffe')
      else if (categorie ==='HOT-SEX')
        router.push('(saved)/hotsex')
      else if (categorie ==='ADRENALINE')
        router.push('(saved)/adrenaline')
      else {
        teamChosen(categorie)
        router.replace('/home')
      }
    }

    //console.log('PRE',userId)
    if (categorie === 'NOS PARTENAIRE') 
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
            <View className="flex-col items-center justify-between  h-[80px] w-[90%] p-5">
            
                <Text style={{color : '#D49FFA'}} className="font-dshadow text-3xl p-1 text-center">{categorie}</Text>
                
            </View>

          </TouchableOpacity>

          

          </View>
    
      ) 
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
        <View className="flex-col items-center justify-between  h-[80px] w-[90%] p-5">
            <Text className="text-primary font-dshadow text-3xl  p-1 text-center">{categorie}</Text>
            
        </View>

      </TouchableOpacity>

      

      </View>
    )
  
}

export default CategorieCard

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
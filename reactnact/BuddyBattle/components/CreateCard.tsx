import { TouchableOpacity , Text, Alert, StyleSheet} from 'react-native'
import {router} from 'expo-router'
import React from 'react'
import { View } from 'react-native-animatable';
import { createVideo } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const CreateCard = ({defi , photo}) => {
    const {name , points , $id} = defi ;
    //console.log($id)
    const {user} = useGlobalContext() ;


    // Déterminer la route actuelle
    const form ={
        title : name ,
        image: photo.uri ,
        points : points ,
        userId: user.$id,
        defiId: $id
        
    } ;
    //console.log('Create',form)
    //console.log('Create',form.userId)
    //console.log('Create',form.title)

  


    const submit2 = async () => {
      console.log(user.$id)
      try {
        await createVideo({
            form  
        });
        
        
        Alert.alert("Success", "Post uploaded successfully");
        router.replace("/home");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        
        
      }
    };
    

      return (
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
        onPress={() => submit2()}
        activeOpacity={0.7}
        >
          <View className="flex-col items-center justify-between  h-[300px] w-[300px] p-5">
              <Text className="text-primary font-dshadow text-lg p-1">DEFI</Text>
              <Text className="text-primary font-psemibold text-lg p-1 text-center">{name}</Text>
              <Text className="text-2xl font-psemibold">{points} ZOINS</Text>
              
          </View>
          <Text style={styles.timerText}>{seconds}s</Text>

        </TouchableOpacity>
      )
    
}

export default CreateCard

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
});
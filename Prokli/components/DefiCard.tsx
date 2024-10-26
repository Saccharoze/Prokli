import { TouchableOpacity , Text, StyleSheet, Modal} from 'react-native'
import React, {useState } from 'react'
import { View } from 'react-native-animatable';
import Create from '@/components/create';

const DefiCard = ({defi , userId}) => {
    const {name , points , $id} = defi ;
    //console.log(defi)
    const [play, setPlay] = useState(false) ;
    
    //console.log('PRE',userId)

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
      onPress={() => setPlay(true)}
      activeOpacity={0.7}
      >
        <View className="flex-col items-center justify-between  h-[300px] w-[300px] p-5">
            <Text className="text-primary font-dshadow text-lg p-1">DEFI</Text>
            <Text className="text-primary font-psemibold text-lg p-1 text-center">{name}</Text>
            <Text className="text-2xl font-psemibold">{points} ZOINS</Text>
            
        </View>

      </TouchableOpacity>

      <Modal
        animationType='fade'
        visible={play}
        transparent={false}
        onRequestClose={() => setPlay(false)}
        >
        <Create 
          defi={defi}
          userId={userId}
        
        />
      </Modal>

      </View>
    )
  
}

export default DefiCard

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
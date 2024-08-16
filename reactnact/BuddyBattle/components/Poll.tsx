import { View, Text, Modal } from 'react-native'
import React, { useState } from 'react'
import RNPoll, { IChoice } from "react-native-poll";
import { updateIntegers } from '@/lib/appwrite';
import { useSegments } from 'expo-router';


const Poll = ({poll}:{poll:never}) => {
    const {$id ,valide , refuse} = poll ;
    const [play, setPlay] = useState(false) ;

    const segments = useSegments();

    // Déterminer la route actuelle
    const isVoted = segments[1];
    //console.log(isVoted)
    
    const [choices, setChoices] = useState<Array<IChoice>>([
        { id: 1, choice: "Validé !", votes: valide },
        { id: 2, choice: "Refusé !", votes: refuse },
      ]);
     
      const totalVotes = choices.reduce((sum, choice) => sum + choice.votes, 0);
    
      
      const handleChoicePress = (selectedChoice: IChoice) => {
        setChoices((prevChoices) =>
          prevChoices.map((choice) =>
            choice.id === selectedChoice.id
              ? { ...choice, votes: choice.votes  }
              : choice
          )
        );
        updateIntegers($id , choices[0].votes , choices[1].votes)
        setPlay(true)
      };
      
      
  if (isVoted === 'home') {    
    return (
      <View>
          <RNPoll
                className="pb-10"
                totalVotes={totalVotes}
                defaultChoiceBorderWidth={1.5}
                choices={choices}
                pollContainerStyle={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
                
                pollItemContainerStyle={{flexDirection: 'row' , justifyContent: 'space-between', marginBottom:10}}
                onChoicePress={handleChoicePress}
              />

          
          
      </View>
    )
  }
  if (isVoted === 'voted') {
    return (
      
            
            
    
      <View>
        <View className="text-black mt-11 flex-row" style={{justifyContent:'space-evenly'}}>
          <Text className="font-dshadow text-sm p-1">TOTAL : {totalVotes}</Text>  
        </View>
        <View className="flex-row justify-center pb-3"  style={{justifyContent:'space-evenly'}}>
            <Text>Validé : {choices[0].votes}</Text>
            <Text>Refusé : {choices[1].votes}</Text>
        </View>
      </View>
    )
  }
}

export default Poll
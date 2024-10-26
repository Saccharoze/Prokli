import { View, Text, Image, ImageBackground } from 'react-native'
import React from 'react'
import {images} from '../constants'

const UserCard = ({users ,rank}) => {
    const {username , avatar , points} = users
    
    //console.log(rank)
    return (

        <View>
        
        
            <View className="justify-between flex-row border border-gray-100 border-1 rounded-3xl m-2 p-2 items-center" style={{
            backgroundColor:'#FFFFFF' ,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 25 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation:10
          }}>
                
                
                
                

                <Text className="text-black font-pextrabold text-1xl pl-5" >
                    #{rank+1}
                </Text>

                <View className={`w-[40px] h-[40px] rounded-3xl 
                -ml-0 border border-white`} >
                    <Image
                    source={{ uri: avatar }}
                    className="w-full h-full rounded-3xl p-2"
                    resizeMode="cover"
                    />
                </View>
                <Text className={`text-white font-psemibold text-1xl pr-10 
                    ${(rank+1 === 1) ? 'text-yellow-300' : 'text-black'} ,
                    ${(rank+1 === 2) ? 'text-gray-300' : null} ,
                    ${(rank+1 === 3) ? 'text-amber-900' : null}
                    `} >
                    {username}
                </Text>
                <Text className={`text-white font-psemibold text-1xl pr-10 
                    ${(rank+1 === 1) ? 'text-yellow-300' : 'text-black'} ,
                    ${(rank+1 === 2) ? 'text-gray-300' : null} ,
                    ${(rank+1 === 3) ? 'text-amber-900' : null}
                    `} >
                    {points}
                </Text>
                
                


            </View>
            </View>
    )
    }

export default UserCard
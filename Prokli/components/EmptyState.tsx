import { View, Text , Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import {images} from '../constants'
import CustomButton from './CustomButton'

const EmptyState = ({title , subtitle}) => {
  return (
    <View className="justify-center items-center px-4">
        <Image source={images.empty} className="w-[270] h-[215]" resizeMode='contain' />


        <Text className="text-1xl font-psemibold text-black mt-2">
           {title}
        </Text>  
        <Text className="font-pmedium text-sm text-gray-400">
           {subtitle}
        </Text>

        <CustomButton 
            
            title="FAITES UN DEFI"
            handlePress={() => router.push('/defi')}
            containerStyles="w-full my-5 font-dshadow"
        />

    </View>
  )
}

export default EmptyState
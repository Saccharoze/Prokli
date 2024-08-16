import { TouchableOpacity , Text} from 'react-native'
import {useSegments} from 'expo-router'
import React from 'react'

const CustomButton = ({title, handlePress , containerStyles , textStyles , isLoading , type}) => {

  const segments = useSegments();

  // Déterminer la route actuelle
  const isHome = segments[1];
  
  if(isHome === 'home') {
    if (type === 'valide') {
      return (
        <TouchableOpacity 
        className={`bg-green-600 rounded-xl min-h-[62px] justify-center items-center 
                    ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
        onPress={handlePress}
        activeOpacity={0.7}
        >
          <Text className={`text-primary font-dshadow text-lg p-1 ${textStyles}`}>{title}</Text>
        </TouchableOpacity>
      )
    }
    else if (type === 'refuse') {
      return (
        <TouchableOpacity 
        className={`bg-red-500 rounded-xl min-h-[62px] justify-center items-center 
                    ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
        onPress={handlePress}
        activeOpacity={0.7}
        >
          <Text className={`text-primary font-dshadow text-lg p-1 ${textStyles}`}>{title}</Text>
        </TouchableOpacity>
      )
    }
    else {
      return (
      <TouchableOpacity 
        className={`rounded-xl min-h-[62px] justify-center items-center 
                    ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
        onPress={handlePress}
        activeOpacittyy={0.7}
      
        style={{
          backgroundColor:"#D49FFA",
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 25 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation:5
        }}
        >
          <Text className={`text-black font-dshadow text-lg p-1 ${textStyles}`}>{title}</Text>
        </TouchableOpacity>
      )
    }
  }
  else {
    return (
      <TouchableOpacity 
      className={`rounded-xl min-h-[62px] justify-center items-center 
                  ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      onPress={handlePress}
      activeOpacity={0.7}
      style={{backgroundColor:"#D49FFA"}}
      >
        <Text className={`p-1 text-black font-dshadow text-lg ${textStyles}`}>{title}</Text>
      </TouchableOpacity>
    )
  }
}

export default CustomButton 
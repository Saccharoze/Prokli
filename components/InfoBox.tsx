import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({title, subtitle, containerStyles , 
    titleStyles}) => {

  if (title === null ) return ;
  else
  return (
    <View className={containerStyles}>
      <Text className={`text-black-100 text-center
      font-psemibold ${titleStyles}`}>{title}</Text>
      <Text className="text-sm text-black-100 text-center
      font-pregular">{subtitle}</Text>
    </View>
  )
}

export default InfoBox
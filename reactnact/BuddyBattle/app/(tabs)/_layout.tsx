import { Text, View, Image } from 'react-native'
import { Tabs } from 'expo-router'

import {icons} from '../../constants' ;

const TabIcon = ({icon,color,name,focused}) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color : color}}>
        {name}
      </Text>
    </View>
  )
}

const tabs_layout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#D49FFA" ,
          tabBarInactiveTintColor: "#909090" ,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth:1,
            borderTopColor: '#ffffff' ,
            height : 84 ,
          }
        }}
      >
        <Tabs.Screen 
          name="home" 
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color,focused}) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Accueil"
                  focused={focused}
                />
            )

        }}
        />
        <Tabs.Screen 
          name="bookmark" 
          options={{
            title: 'Bookmark',
            headerShown: false,
            tabBarIcon: ({color,focused}) => (
                <TabIcon
                  icon={icons.bookmark}
                  color={color}
                  name="Classement"
                  focused={focused}
                />
            )

        }}
        />
        
        
        <Tabs.Screen 
          name="defi" 
          options={{
            title: 'test',
            headerShown: false,
            tabBarIcon: ({color,focused}) => (
                <TabIcon
                  icon={icons.plus}
                  color={color}
                  name="Défis"
                  focused={focused}
                />
            )

        }}
        />
        <Tabs.Screen 
          name="profile" 
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({color,focused}) => (
                <TabIcon
                  icon={icons.profile}
                  color={color}
                  name="Profile"
                  focused={focused}
                />
            )

        }}
        />
      </Tabs>
    </>
  )
}

export default tabs_layout


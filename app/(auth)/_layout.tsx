import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const auth_layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='sign-in'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='sign-up'
          options={{
            headerShown: false
          }} 
        />
      </Stack>

      
    </>
  )
}

export default auth_layout


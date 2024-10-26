import { Text, Image , View , ScrollView, Alert  } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView ,} from 'react-native-safe-area-context'
import {Link, router} from 'expo-router'

import { images } from '@/constants' ;
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { getCurrentUser, signIn } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { LinearGradient } from 'expo-linear-gradient';

const SignIn = () => {

  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [ isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email:'' ,
    password:''
  
  })
  
  
  const submit = async () => {

    if (form.email === "" || form.password === "") {
      Alert.alert('Erreur' , 'Vous devez remplir tous les champs ')

    }

    setIsSubmitting(true) ;

    try {
      await signIn(
        form.email ,
        form.password ,
      )

      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
      //set it to global state ...

      router.replace('/home') ;
    } catch (error) {
      return console.log('SIGN-IN' , error); 
    } finally {
      setIsSubmitting(false)
    }
    
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <LinearGradient
        // Background Linear Gradient
        colors={[ '#FF7E77' , '#FFFFFF']}
        style={{position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%'}}
        />

      <ScrollView>
      <View className="w-full justify-center min-h-[85vh] px-5 my-">
      

          <Text className="text-black text-2xl mt-6 font-dshadow">Connecte toi !</Text>

          <FormField 
            title='Email'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email:e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          /> 

          <FormField 
            title='Mot de passe'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password:e })}
            otherStyles='mt-7'
          /> 

          <CustomButton
            title="Se connecter"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-black font-pbold
            ">
              Pas encore de compte ?
            </Text>
            <Link href="/sign-up" className="text-lg font-dshadow" style={{color : '#D46AFA'}}>
              S'inscrire !</Link>

          </View>
        </View>
      </ScrollView>
      
      
    </SafeAreaView>
  )
}

export default SignIn

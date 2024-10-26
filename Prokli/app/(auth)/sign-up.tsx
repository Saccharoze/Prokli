import { Text, Image , View , ScrollView, Alert  } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView ,} from 'react-native-safe-area-context'
import {Link, router} from 'expo-router'

import { images } from '@/constants' ;
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';

import {createUser} from '../../lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider';
import { LinearGradient } from 'expo-linear-gradient';

const SignUp = () => {


  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [ isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email:'' ,
    password:'',
  
  })
  


  const submit = async () => {

    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert('Erreur' , 'Vous devez remplir tous les champs ')

    }

    setIsSubmitting(true) ;

    try {
      const result = await createUser(
        form.email ,
        form.password ,
        form.username 
      ) ;

      setUser(result);
      setIsLoggedIn(true);
      console.log(result)
      router.replace('/defi') ;
    } catch (error) {
      return console.log('SIGN-UP' , error); 
    } finally {
      setIsSubmitting(false)
    }
    
  }


  return (
    <SafeAreaView className="bg-white h-full">
      <LinearGradient
        // Background Linear Gradient
        colors={[ '#FCABA6' ,'#F99FFA' ,  '#FFFFFF']}
        style={{position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%'}}
        />

      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-5 my-4">
          

          <Text className="text-black text-2xl mt-6 font-dshadow">Inscris toi !</Text>

          <FormField
            title="Nom d'utilisateur"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

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
            title="S'inscrire"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-black font-pbold
            ">
              Déjà un compte ?
            </Text>
            <Link href="/sign-in" className="text-lg font-dshadow" style={{color : '#D46AFA'}}>
              CONNECTE TOI !</Link>

          </View>
        </View>
      </ScrollView>
      
    </SafeAreaView>
  )
}

export default SignUp

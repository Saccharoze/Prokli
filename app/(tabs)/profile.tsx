import { View , FlatList , Image ,TouchableOpacity , RefreshControl, Alert} from 'react-native'
import React, {useCallback, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as DocumentPicker from "expo-document-picker";
import EmptyState from '@/components/EmptyState'
import {getCurrentUser, getUserPosts, signOut, updateAvatar } from '@/lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import { icons } from '@/constants'
import InfoBox from '@/components/InfoBox'
import {router, useFocusEffect} from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'



const Profile = () => {

  const { user , setUser , setIsLoggedIn} = useGlobalContext() ;
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false) ;
  const {data: posts , refetch} = useAppwrite(
    () => getUserPosts(user.$id)
  ) ;
  

  const fetchUserData = async () => {
    // Remplacez cette fonction par la logique nécessaire pour obtenir les données utilisateur
    const updatedUser = await getCurrentUser(); // Exemple de fonction pour obtenir les données
    setUser(updatedUser);
  };

  const onRefresh = async () => {
    
    setRefreshing(true) ;

    fetchUserData();

    await refetch();
    setRefreshing(false) ;
  }

 const logout = async () => {
    await signOut() ;
    setUser(null) ;
    setIsLoggedIn(false)

    if(router.canDismiss()) router.dismissAll() ;
    else router.replace('/sign-in')
 }

 const openPicker = async (selectType) => {

  

  const result = await DocumentPicker.getDocumentAsync({
    type: ["image/png", "image/jpg" , 'image/jpeg' , "image/HEIF" , "image/heic" ]
        
  });
  if (!result.canceled) {
    
      const form = {
        uri : result.assets[0].uri ,
        userId : user.$id
      } ;
      console.log(form)
      
      console.log(form)
      if (form.uri === null) {
        return Alert.alert("Please provide all fields");
      }
      console.log(user.$id)
      setUploading(true);
      try {
        await updateAvatar({
          form
        });
    
        Alert.alert("Success", "Votre Avatar a été mis à jour");
        
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        
        setUploading(false);
      }
    
  } else {
    return ;
  }


  };

  if (user === null) return
  else {
  return (
    <SafeAreaView className="h-full" style={{backgroundColor:"#FFFFFF"}}>
      <LinearGradient
        // Background Linear Gradient
        colors={[ '#DDBFFF' , '#FFFFFF' ]}
        style={{position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%'}}
        />
      <FlatList
        data={posts}
        //data={[]}
        ItemSeparatorComponent={() => <View style={{height: 90}} />}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
            <VideoCard video={item} />
        
        )}
        ListHeaderComponent = {() => (
          <View className="w-full justify-center items-center
          mt-6 mb-12 px-4">
            <TouchableOpacity className="w-full items-end mb-10"
            onPress={logout}>
              <Image source={icons.logout}
                resizeMode='contain'
                className="w-7 h-7"
              />
            </TouchableOpacity >
            <View className="w-16 h-16 border border-black-100
            rounded-lg justify-center items-center">
              <TouchableOpacity className="w-full h-full "
                onPress={() => openPicker("image")}>
              <Image source={{uri: user?.avatar}} 
              className="w-[100%] h-[100%] rounded-lg"
              resizeMode='cover'
              />
              </TouchableOpacity>
            </View>

            <InfoBox
              title={user?.username}
              containerStyles='mt-5'
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles='mr-10'
                titleStyles="text-xl"
              />
              <InfoBox
                title={user.points}
                subtitle="Points"
                titleStyles="text-xl"
                containerStyles={EmptyState}
              />
            </View>

          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="Aucun défi trouvé pour cette recherche"
            subtitle="Réalisez votre premier défi !"
          />
        )}

        refreshControl={<RefreshControl refreshing = {refreshing} onRefresh={onRefresh} />}

      />
    </SafeAreaView>
  )
}
}

export default Profile
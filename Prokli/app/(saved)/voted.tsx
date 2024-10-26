import { Text , View , FlatList , Image, RefreshControl, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


import {images} from '../../constants'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { getLatestPosts, getVotedPosts } from '@/lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import Poll from '@/components/Poll'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'


const voted = () => {

  const { user , setUser , setIsLoggedIn} = useGlobalContext() ;
  const {data: posts , refetch} = useAppwrite(
    () => getVotedPosts(user.$id)
  ) ;
  const {data: latestPosts} = useAppwrite(getLatestPosts) ;

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true) ;
    await refetch();
    setRefreshing(false) ;
  }



  return (
    <SafeAreaView className="bg-white h-full">
      <LinearGradient
        // Background Linear Gradient
        colors={['#DDBFFF' , '#FFFFFF' ]}
        style={{position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%'}}
        />
      <FlatList
        data={posts}
        //data={[]}
        viewabilityConfig={{
          itemVisiblePercentThreshold:10
        }}
        
        ItemSeparatorComponent={() => <View style={{height: 40}} />}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <View className="px-4 border-2 border-gray-100 rounded-2xl shadow-2xl" space-y style={{backgroundColor:"FFFFFF"}}>
            <VideoCard video={item} />
            <Poll poll={item} />
         

              
              
              {/*<CustomButton
                type={'valide'}
                title="VALIDE !!!"
                handlePress={submit}
                containerStyles="w-[50%] mt-8 mb-8 mr-1"
              />
              <CustomButton
              type={'refuse'}
              title="REFUSE !!!"
              handlePress={submit}
              containerStyles="w-[50%] mt-8 mb-8 ml-1"
              />
              */}
          
          </View>
          
        )}
        ListHeaderComponent = {() => (
          <View className="my-6 px-4 space-y-6">
            <View className="jsutify-between items-start flex-row mb-6">
              <View className="P">
                <Text className="font-pmedium text-sm text-black-100">
                  Vos votes
                </Text>
                <Text className="text-1xl font-psemibold text-black">
                  {user?.username}
                </Text>
              </View>
              <View className="relative mt-3 ml-20">
              </View>
            </View>

            <SearchInput />
            <View className="w-full flex-1 pt-2 pb-5 items-end">
              <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
                <Text className="font-dshadow text-black-500 text-lg p-1">
                  ALLEZ VOTER
                </Text>
              </TouchableOpacity>
              
              {/*<Trending posts={latestPosts ?? []}/>*/}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="Aucun défi trouvé"
            subtitle="Soyez le premier à réaliser un défis"
          />
        )}

        refreshControl={<RefreshControl refreshing = {refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default voted
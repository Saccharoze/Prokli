import { Text , View , FlatList ,RefreshControl, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getNotVotedPosts} from '@/lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import Poll from '@/components/Poll'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'


const home = () => {

  const { user } = useGlobalContext() ;
  const {data: posts , refetch} = useAppwrite(
    () => getNotVotedPosts(user.$id)
  ) ;
  //console.log(user)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true) ;
    getAllPosts() ;
    await refetch();
    setRefreshing(false) ;
  }


  if (user === null) return (<View></View>)
  if (user === undefined) return (<View></View>)

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

        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <View className="px-4">
            <VideoCard video={item} userId={user.$id} />
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
          <View className="my-6 px-4">
            <View className="jsutify-between items-start flex-row mb-6">
              <View className="P">
                <Text className="font-pmedium text-sm text-black-100">
                  Bienvenue
                </Text>
                <Text className="text-1xl font-psemibold text-black">
                  {user?.username}
                </Text>
              </View>
              
            </View>

            <SearchInput />
            <View className="w-full pt-5 pb-0 items-end">
              <TouchableOpacity onPress={() => router.push('/(saved)/voted')}>
                <Text className="font-dshadow text-black-500 text-lg mb-3 p-1">
                  VOS VOTES
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

export default home
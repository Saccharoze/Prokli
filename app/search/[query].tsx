import { Text , View , FlatList } from 'react-native'
import React, { useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import {searchPosts } from '@/lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'


const Search = () => {
  const {query} = useLocalSearchParams() ;
  const {data: posts , refetch} = useAppwrite(
    () => searchPosts(query)
  ) ;
  

  useEffect(() => {
    refetch()
  } , [query])

  


  return (
    <SafeAreaView className="bg-white h-full">
      <LinearGradient
        // Background Linear Gradient
        colors={[ '#CC59D2' , '#FFFFFF']}
        style={{position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%'}}
        />
      <FlatList
        data={posts}
        //data={[]}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent = {() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-black-100">
              Résultat de la recherche
            </Text>
            <Text className="font-psemibold text-sm text-black">
              {query}
            </Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="Aucun défi trouvé pour cette recherche"
            subtitle=" "
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search
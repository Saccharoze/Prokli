import { View, Text ,FlatList, ImageBackground , Modal , StyleSheet , TouchableOpacity , Image  } from 'react-native'
import * as Animatable from 'react-native-animatable'
import React, { useState } from 'react'

import {icons} from '../constants'
import { Video , ResizeMode} from 'expo-av'


const zoomIn = {
  0: {
    scale: 0.9
  } ,
  1: {
    scale:1 ,
  }
}

const zoomOut = {
  0: {
    scale: 1
  } ,
  1: {
    scale:0.9 ,
  }
}

const TrendingItem = ( {activeItem , item} ) => {

  const [play, setPlay] = useState(false) ;

  

  return ( 
    <View>
        {play ? (
        <Modal
          animationType='fade'
          transparent={play}
          visible={true}
          onRequestClose={() => setPlay(false)}
        >
          <Animatable.View
          className=""
          duration={1000}
          style={styles.modalContainer}
        >
          <View style={{width:'100%' , height:'100%'}}>
            <TouchableOpacity
              style={{width:'100%' , height:'100%'}}
              activeOpacity={0.9}
              onPress={() => setPlay(false)}
            >
              <ImageBackground
                source={{ uri: item.photo }}
                style={{width:'100%' , height:'100%'}}
                resizeMode={ResizeMode.COVER}
              />
            </TouchableOpacity>
          </View>
          </Animatable.View>
        </Modal>
      ) : (
        <Animatable.View
          className="mr-5"
          animation={activeItem === item.$id ? zoomIn : zoomOut}
          duration={1000}
        >
        <TouchableOpacity className="relative justify-center
        items-center" activeOpacity={0.7}
        onPress={() => setPlay(true)}>
          <ImageBackground
            source={{
              uri: item.photo
            }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden
            shadow-lg shadow-black/40"
            resizeMode='cover' 
          />

        </TouchableOpacity>
        </Animatable.View>
      )}  
      </View>
  )
}

const Trending = ({posts}) => {

  const [activeItem, setActiveItem] = useState(posts[1])

  const viewableItemsChanged = ({viewableItems}) => {
    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }


  return (
    <FlatList 
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({item}) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold:30
      }}
      contentOffset={{x:170}}
      
      horizontal 
      
    />
  )
}


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Trending
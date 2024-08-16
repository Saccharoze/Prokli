import { Text ,TouchableOpacity, Image, Modal, View, StyleSheet, Animated, Dimensions } from 'react-native'
import React, { useState , useRef, useEffect } from 'react'
import { icons } from '@/constants';
import { reportDefi } from '@/lib/appwrite';
import { LinearGradient } from 'expo-linear-gradient';


const VideoCard = ({ video , userId }: { video: never  , userId : any }) => {

  
  const { title, photo , $id} = video;
  const [play, setPlay] = useState(false) ;
  const [report, setReport] = useState(false)
  
  if (report && play) {
    return ;
  }
  else if (report) {
    return (
      <View>
          <Modal
            animationType="slide"
            transparent={true}
            
            
          >
            <View style={styles.centeredView}>
            
              <View style={styles.modalView}>
              <LinearGradient
                // Background Linear Gradient
                colors={[ '#FF3333' , '#FFFFFF']}
                style={{position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: '100%' ,
                  borderRadius: 20
                }}
                />
                <Text style={styles.modalText} className="font-psemibold">Voulez vous signaler cette photo ?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button , {backgroundColor: 'rgba(255, 0, 0, 0.9)' , marginRight : 15 }]} onPress={() => {reportDefi($id , userId) ; setPlay(true)}}>
                    <Text style={styles.buttonText}>OUI C'EST HONTEUX !</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button , {backgroundColor: 'rgba(0,0,0, 0.9)' , marginLeft : 15 }]} onPress={() => setReport(false)}>
                    <Text style={styles.buttonText}>   Non   </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
    )
  }
  return (
    <View className="flex flex-col items-center -mb-9 mt-1">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          
          

          <View className="justify-center flex-row flex-1 ml-3 -mb-10
          gap-y-1 rounded-3xl">
            <Text className="text-black font-psemibold text-1.5xl" style={{color:"#000000"}} >
              <Text className="font-dshadow">DEFI </Text>: {title}
            </Text>
            


          </View>
        </View>

        <TouchableOpacity 
          className="pt-3 -left-3"
          activeOpacity={0.7}
          onPress={() => setReport(true)}
        >
          <Image source={icons.menu} className="w-15 h-5"
          resizeMode='contain' />
        </TouchableOpacity>
      </View>
        
        
        <TouchableOpacity
        
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          style={styles.touchable}
          >
          <Image 
            source={{ uri: photo}}
            style={styles.image}
            resizeMode='cover'
          />
        </TouchableOpacity>

        <Modal
        animationType='fade'
        visible={play}
        transparent={false}
        onRequestClose={() => setPlay(false)}
        >
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity 
            style={styles.fullscreenImageContainer}
            onPress={() => setPlay(false)}
            
          >
            <Image
              source={{ uri: photo }}
              style={styles.fullscreenImage}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      </Modal>
     
    
    </View>
  )
}



const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    aspectRatio: 16 / 9,  // Maintain the aspect ratio
    borderRadius: 16,
    marginTop: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#888',
    borderWidth: 1,
    overflow: 'hidden', // Ensure the image is clipped to the border radius
  },
  image: {
    width: '100%',
    height: '100%',
  },

  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImageContainer: {
    width: '100%',
    height: '100%',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
  },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
    button: {
      borderRadius: 10,
      padding: 10,
      paddingHorizontal : 20 ,
      elevation: 2,
    },
    text: {
      backgroundColor: 'transparent',
      fontSize: 15,
      color: '#fff',
    },
    loaderContainer: {
      flex: 1 ,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 30,
      textAlign: 'center',
      fontSize : 15
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonText: {
      padding : 10 ,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });


export default VideoCard
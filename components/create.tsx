import React, {useRef, useState , useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import { Button } from 'react-native';
import { createVideo } from '@/lib/appwrite';
import { images } from '@/constants';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';

const Create = ({defi, userId}) => {
  const {name ,points , $id} = defi ;
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);

  //console.log('POST',userId)
  
  useFocusEffect(
    useCallback(() => {
      // Code à exécuter lors de la mise au focus de l'écran

      return () => {
        // Code à exécuter lors de la sortie de l'écran
        setPhoto(null)
      };
    }, [])
  );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestMicrophonePermissionsAsync();
      if (status !== 'granted') {
        alert('Nous avons besoin de votre permission pour utiliser le microphone');
      }
    })();
  }, []);

  if (!permission) {
    // Les permissions de la caméra sont encore en cours de chargement.
    return <View />;
  }

  if (!permission.granted) {
    // Les permissions de la caméra ne sont pas encore accordées.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Nous avons besoin de votre permission pour afficher la caméra</Text>
        <Button onPress={requestPermission} title="Accorder la permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    //console.log('OK C BON')
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo);
      
    }
  };


  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          maxDuration: 60, // Optionnel : limite la durée de la vidéo à 60 secondes
          mute: false // Assurez-vous que l'audio est enregistré
        });
        console.log('Video recorded: ', video.uri);
        setVideo(video);
        await MediaLibrary.createAssetAsync(video.uri);
      } catch (error) {
        console.error('Error recording video: ', error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if(video === null) console.log('heeeey')
    if (cameraRef.current && isRecording) {
      video.stopRecording();
      setIsRecording(false);
    }
  };

  
  const handlePressIn = () => {
    // Démarrer l'enregistrement après un court délai pour éviter l'arrêt immédiat
    setTimeout(startRecording, 100);
  };

  const handlePressOut = () => {
    // Arrêter l'enregistrement après un court délai pour éviter l'arrêt immédiat
    setTimeout(stopRecording, 100);
  };
  
  //console.log('Create',form)
  //console.log('Create',form.userId)
  //console.log('Create',form.title)

  const submit2 = async () => {
    
    router.replace("/home");
    const form ={
      title : name ,
      image: photo.uri ,
      points : points ,
      userId: userId
      
    } ;

    console.log(form)

    console.log(form.title)

    console.log(form.userId)
    setUploading(true);
    try {
      const photoId = await createVideo({
          form  
      });
      
      
      Alert.alert("Success", "Post uploaded successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      
      
      setUploading(false);
    }
  };


    return (
      <View style={styles.container}>
        {video ? (
          <View>
            
            <View style={styles.touchable}>
              <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: 'https://menahem.iiens.net/Web/jardin/jardin1image/Snapchat-1047811189.mp4' }}
                resizeMode="cover"
                shouldPlay
                isLooping
                useNativeControls
              />
            
            {video && (
              <Button title="Reprendre une vidéo" onPress={() => setVideo(null)} />
            )}
            </View>

          </View>
        ) : photo ? (
          <View>
            
            <View style={styles.touchable}>
              <Image source={{ uri: photo.uri }} style={styles.camera} resizeMode='cover'/>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  submit2()}}
              >
                <Text className="position absolute
                bottom-8 -left-5 text-2xl p-2 font-dshadow">POSTE</Text>
              </TouchableOpacity>
            </View>

          </View>
        ) : (
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Image source={images.reverse} className="w-[70px] h-[70px] ml-5"/>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button} 
                onPress={takePhoto} 
                onLongPress={handlePressIn}
                onPressOut={handlePressOut}
                
              >
                <Image source={images.logoPhoto} className="w-[90px] h-[90px] relative -left-10 "/>
              </TouchableOpacity>
            </View>
          </CameraView>
        )}
      </View>
    );
  }

export default Create;

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    height:'100%',  // Maintain the aspect ratio
    borderTopEndRadius: 16,
    marginTop: 0,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    overflow: 'hidden', // Ensure the image is clipped to the border radius
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    width:'100%',
    height:'100%'
  },
  buttonContainer: {
    flex: 1,
    justifyContent : 'flex-start' ,
    alignItems : 'flex-start' ,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 90,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

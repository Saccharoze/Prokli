import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Button } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';

import { createPost } from '../lib/appwrite';
import { images } from '../constants';

export type Defi = { $id: string; name: string; points: number };

type Props = { defi: Defi; userId: string; onDone: () => void };

// Full-screen camera for a challenge. A tap takes the proof photo, then "POSTE" uploads it.
// A long press records a video, saved to the phone's gallery (videos are not posted).
const ChallengeCamera = ({ defi, userId, onDone }: Props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [photo, setPhoto] = useState<{ uri: string } | null>(null);
  const [video, setVideo] = useState<{ uri: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    Camera.requestMicrophonePermissionsAsync().then(({ status }) => {
      if (status !== 'granted') Alert.alert('Nous avons besoin de votre permission pour utiliser le microphone');
    });
  }, []);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Nous avons besoin de votre permission pour afficher la caméra</Text>
        <Button onPress={requestPermission} title="Accorder la permission" />
      </View>
    );
  }

  const takePhoto = async () => {
    const picture = await cameraRef.current?.takePictureAsync();
    if (picture) setPhoto(picture);
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    setIsRecording(true);
    try {
      const recorded = await cameraRef.current.recordAsync({ maxDuration: 60 });
      if (recorded) {
        setVideo(recorded);
        await MediaLibrary.createAssetAsync(recorded.uri);
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (isRecording) cameraRef.current?.stopRecording();
  };

  // Goes back to the home feed first, so a second tap can't post the photo twice.
  const post = async () => {
    if (!photo) return;
    onDone();
    router.replace('/home');
    try {
      await createPost({ title: defi.name, uri: photo.uri, points: defi.points, userId });
      Alert.alert('Défi posté !', 'Les autres joueurs vont voter.');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  if (video) {
    return (
      <View style={styles.preview}>
        <Video
          source={{ uri: video.uri }}
          style={styles.fill}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          useNativeControls
        />
        <Button title="Reprendre une vidéo" onPress={() => setVideo(null)} />
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.preview}>
        <Image source={{ uri: photo.uri }} style={styles.fill} resizeMode="cover" />
        <TouchableOpacity activeOpacity={0.7} onPress={post}>
          <Text className="absolute bottom-8 -left-5 text-2xl p-2 font-display">POSTE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CameraView style={styles.fill} facing={facing} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
          <Image source={images.switchCamera} className="w-[70px] h-[70px] ml-5" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={takePhoto}
          onLongPress={startRecording}
          onPressOut={stopRecording}
        >
          <Image source={images.photoButton} className="w-[90px] h-[90px] relative -left-10" />
        </TouchableOpacity>
      </View>
    </CameraView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  preview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: { width: '100%', height: '100%' },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginBottom: 90,
  },
  button: { flex: 1, alignSelf: 'flex-end', alignItems: 'flex-start' },
});

export default ChallengeCamera;

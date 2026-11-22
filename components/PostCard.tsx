import { useState } from 'react';
import { Text, TouchableOpacity, Image, Modal, View, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { reportPost } from '../lib/appwrite';
import GradientBackground from './GradientBackground';

type Props = {
  post: { $id: string; title: string; photo: string };
  // needed to report the photo; without it the report button is hidden
  userId?: string;
};

// A posted challenge photo: tap to see it full screen, "..." to report it.
const PostCard = ({ post, userId }: Props) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [confirmReport, setConfirmReport] = useState(false);
  const [hidden, setHidden] = useState(false);

  const report = async () => {
    try {
      await reportPost(post.$id, userId);
      setHidden(true);
      Alert.alert('La photo a bien été signalée !');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setConfirmReport(false);
    }
  };

  if (hidden) return null;

  return (
    <View className="flex flex-col items-center -mb-9 mt-1">
      <View className="flex flex-row gap-3 items-start">
        <View className="justify-center flex-row flex-1 ml-3 -mb-10 rounded-3xl">
          <Text className="font-body-semibold" style={{ color: '#000000' }}>
            <Text className="font-display">DEFI </Text>: {post.title}
          </Text>
        </View>
        {userId ? (
          <TouchableOpacity className="pt-3 -left-3" activeOpacity={0.7} onPress={() => setConfirmReport(true)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#000000" />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity activeOpacity={0.7} onPress={() => setFullscreen(true)} style={styles.thumbnail}>
        <Image source={{ uri: post.photo }} style={styles.fill} resizeMode="cover" />
      </TouchableOpacity>

      <Modal animationType="fade" visible={fullscreen} onRequestClose={() => setFullscreen(false)}>
        <View style={styles.fullscreen}>
          <TouchableOpacity style={styles.fill} onPress={() => setFullscreen(false)}>
            <Image source={{ uri: post.photo }} style={styles.fill} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={confirmReport} onRequestClose={() => setConfirmReport(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <GradientBackground colors={['#FF3333', '#FFFFFF']} style={{ borderRadius: 20 }} />
            <Text style={styles.modalText} className="font-body-semibold">
              Voulez vous signaler cette photo ?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'rgba(255, 0, 0, 0.9)', marginRight: 15 }]}
                onPress={report}
              >
                <Text style={styles.buttonText}>OUI C'EST HONTEUX !</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'rgba(0, 0, 0, 0.9)', marginLeft: 15 }]}
                onPress={() => setConfirmReport(false)}
              >
                <Text style={styles.buttonText}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#888',
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: { width: '100%', height: '100%' },
  fullscreen: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: { marginBottom: 30, textAlign: 'center', fontSize: 15 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { borderRadius: 10, padding: 10, paddingHorizontal: 20, elevation: 2 },
  buttonText: { padding: 10, color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

export default PostCard;

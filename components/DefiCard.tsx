import { useState } from 'react';
import { TouchableOpacity, Text, Modal, View } from 'react-native';

import { cardShadow } from '../constants';
import ChallengeCamera, { Defi } from './ChallengeCamera';

// A challenge card. Tapping it opens the camera to take the proof photo.
const DefiCard = ({ defi, userId }: { defi: Defi; userId: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        className="bg-white rounded-xl min-h-[62px] flex-row justify-center items-center"
        style={cardShadow}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <View className="flex-col items-center justify-between h-[300px] w-[300px] p-5">
          <Text className="text-ink font-display text-lg p-1">DEFI</Text>
          <Text className="text-ink font-body-semibold text-lg p-1 text-center">{defi.name}</Text>
          <Text className="text-2xl font-body-semibold">{defi.points} ZOINS</Text>
        </View>
      </TouchableOpacity>

      <Modal animationType="fade" visible={open} transparent={false} onRequestClose={() => setOpen(false)}>
        <ChallengeCamera defi={defi} userId={userId} onDone={() => setOpen(false)} />
      </Modal>
    </View>
  );
};

export default DefiCard;

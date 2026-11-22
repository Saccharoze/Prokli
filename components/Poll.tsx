import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import RNPoll, { IChoice } from 'react-native-poll';

import { vote } from '../lib/appwrite';

type Props = {
  poll: { $id: string; valide: number; refuse: number };
  // 'vote' shows the two buttons (home feed), 'results' only the counts (the user's votes)
  mode: 'vote' | 'results';
};

const Poll = ({ poll, mode }: Props) => {
  const [choices] = useState<IChoice[]>([
    { id: 1, choice: 'Validé !', votes: poll.valide },
    { id: 2, choice: 'Refusé !', votes: poll.refuse },
  ]);
  const totalVotes = choices.reduce((sum, choice) => sum + choice.votes, 0);

  // RNPoll adds 1 to the pressed choice's `votes` (in place) before calling this.
  const handleChoicePress = () => {
    vote(poll.$id, choices[0].votes, choices[1].votes).catch((error) => Alert.alert('Erreur', error.message));
  };

  if (mode === 'vote') {
    return (
      <RNPoll
        totalVotes={totalVotes}
        defaultChoiceBorderWidth={1.5}
        choices={choices}
        pollContainerStyle={{ flexDirection: 'row', justifyContent: 'space-between' }}
        pollItemContainerStyle={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}
        onChoicePress={handleChoicePress}
      />
    );
  }

  return (
    <View>
      <View className="mt-11 flex-row" style={{ justifyContent: 'space-evenly' }}>
        <Text className="font-display text-sm p-1">TOTAL : {totalVotes}</Text>
      </View>
      <View className="flex-row pb-3" style={{ justifyContent: 'space-evenly' }}>
        <Text>Validé : {choices[0].votes}</Text>
        <Text>Refusé : {choices[1].votes}</Text>
      </View>
    </View>
  );
};

export default Poll;

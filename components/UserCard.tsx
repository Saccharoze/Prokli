import { View, Text, Image } from 'react-native';

type Props = { user: { username: string; avatar: string; points: number }; rank: number };

// Gold, silver and bronze for the first three.
const RANK_COLORS = ['text-yellow-300', 'text-gray-300', 'text-amber-900'];

// One row of the user leaderboard. `rank` starts at 0.
const UserCard = ({ user, rank }: Props) => {
  const color = RANK_COLORS[rank] ?? 'text-black';

  return (
    <View
      className="justify-between flex-row border border-gray-100 rounded-3xl m-2 p-2 items-center"
      style={{
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
      }}
    >
      <Text className="text-black font-body-extrabold pl-5">#{rank + 1}</Text>
      <View className="w-[40px] h-[40px] rounded-3xl border border-white">
        <Image source={{ uri: user.avatar }} className="w-full h-full rounded-3xl" resizeMode="cover" />
      </View>
      <Text className={`font-body-semibold pr-10 ${color}`}>{user.username}</Text>
      <Text className={`font-body-semibold pr-10 ${color}`}>{user.points}</Text>
    </View>
  );
};

export default UserCard;

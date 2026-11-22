import { ActivityIndicator, Pressable, Text } from 'react-native';

type Props = { label: string; onPress: () => void; loading?: boolean; className?: string };

// The app's main button: lilac, rounded, with a spinner while `loading`.
export default function Button({ label, onPress, loading = false, className = '' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`bg-lilac rounded-xl min-h-[62px] items-center justify-center px-4 ${className}`}
      style={({ pressed }) => ({ opacity: pressed || loading ? 0.6 : 1 })}
    >
      {loading ? (
        <ActivityIndicator color="#161622" />
      ) : (
        <Text className="font-display text-lg text-black">{label}</Text>
      )}
    </Pressable>
  );
}

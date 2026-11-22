import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = { colors: string[]; style?: StyleProp<ViewStyle> };

// Gradient drawn behind a screen's content, filling its parent.
const GradientBackground = ({ colors, style }: Props) => (
  <LinearGradient colors={colors} style={[StyleSheet.absoluteFill, style]} />
);

export default GradientBackground;

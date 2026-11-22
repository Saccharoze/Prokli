import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import Button from './Button';
import GradientBackground from './GradientBackground';
import TextField from './TextField';

export type AuthValues = { username: string; email: string; password: string };

type Props = {
  title: string;
  withUsername?: boolean;
  submitLabel: string;
  onSubmit: (values: AuthValues) => Promise<void>;
  errorMessage: (error: Error) => string;
  switchText: string;
  switchLabel: string;
  switchHref: '/sign-in' | '/sign-up';
  colors: string[];
};

// The sign-in and sign-up screens: the same form, with or without a username.
export default function AuthForm(props: Props) {
  const [values, setValues] = useState<AuthValues>({ username: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const set = (key: keyof AuthValues) => (text: string) => setValues({ ...values, [key]: text });

  const submit = async () => {
    const required = props.withUsername
      ? [values.username, values.email, values.password]
      : [values.email, values.password];
    if (required.some((value) => !value.trim())) return Alert.alert('Erreur', 'Vous devez remplir tous les champs');

    setBusy(true);
    try {
      await props.onSubmit(values);
    } catch (error) {
      Alert.alert('Erreur', props.errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <GradientBackground colors={props.colors} />
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center px-5 my-4">
          <Text className="font-display text-2xl text-black mt-6">{props.title}</Text>
          {props.withUsername && (
            <TextField
              label="Nom d'utilisateur"
              value={values.username}
              onChangeText={set('username')}
              className="mt-10"
            />
          )}
          <TextField
            label="Email"
            value={values.email}
            onChangeText={set('email')}
            keyboardType="email-address"
            className="mt-7"
          />
          <TextField
            label="Mot de passe"
            value={values.password}
            onChangeText={set('password')}
            secret
            className="mt-7"
          />
          <Button label={props.submitLabel} onPress={submit} loading={busy} className="mt-7" />
          <View className="flex-row justify-center gap-2 pt-5">
            <Text className="font-body-bold text-lg text-black">{props.switchText}</Text>
            <Link href={props.switchHref} className="font-display text-lg text-orchid">
              {props.switchLabel}
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

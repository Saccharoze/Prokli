import { router } from 'expo-router';

import AuthForm from '../../components/AuthForm';
import { useSession } from '../../context/SessionProvider';

export default function SignIn() {
  const { signIn } = useSession();

  return (
    <AuthForm
      title="Connecte toi !"
      submitLabel="Se connecter"
      onSubmit={async ({ email, password }) => {
        await signIn(email, password);
        router.replace('/home');
      }}
      errorMessage={() => 'Votre email ou votre mot de passe est incorrect'}
      switchText="Pas encore de compte ?"
      switchLabel="S'inscrire !"
      switchHref="/sign-up"
      colors={['#FF7E77', '#FFFFFF']}
    />
  );
}

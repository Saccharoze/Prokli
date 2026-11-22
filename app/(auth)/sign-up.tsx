import { router } from 'expo-router';

import AuthForm from '../../components/AuthForm';
import { useSession } from '../../context/SessionProvider';

export default function SignUp() {
  const { signUp } = useSession();

  return (
    <AuthForm
      title="Inscris toi !"
      withUsername
      submitLabel="S'inscrire"
      onSubmit={async (values) => {
        await signUp(values);
        router.replace('/defi');
      }}
      errorMessage={(error) => error.message}
      switchText="Déjà un compte ?"
      switchLabel="CONNECTE TOI !"
      switchHref="/sign-in"
      colors={['#FCABA6', '#F99FFA', '#FFFFFF']}
    />
  );
}

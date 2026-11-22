import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { fetchPlayer, login, logout, registerPlayer } from '../lib/appwrite';

const SessionContext = createContext(null);

// The signed-in player for every screen. status: 'loading' at startup, then 'in' or 'out'.
export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession() must be used inside <SessionProvider>');
  return session;
}

export default function SessionProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [status, setStatus] = useState('loading');

  // Reads the player's document again (points, team, avatar change on the server).
  const refresh = useCallback(async () => {
    const current = await fetchPlayer();
    setPlayer(current);
    setStatus(current ? 'in' : 'out');
    return current;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = {
    player,
    status,
    refresh,
    signIn: async (email, password) => {
      await login(email, password);
      return refresh();
    },
    signUp: async (fields) => {
      await registerPlayer(fields);
      return refresh();
    },
    signOut: async () => {
      await logout();
      setPlayer(null);
      setStatus('out');
    },
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

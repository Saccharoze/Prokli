import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

// Runs `load` when the screen mounts and again when one of `deps` changes.
// `data` keeps its last value while reloading; a failed load shows an alert.
export default function useQuery(load, deps = [], initial = []) {
  const [state, setState] = useState({ data: initial, loading: true });
  const mounted = useRef(true);

  const reload = useCallback(async () => {
    setState((current) => ({ ...current, loading: true }));
    try {
      const data = await load();
      if (mounted.current) setState({ data, loading: false });
    } catch (error) {
      if (mounted.current) setState((current) => ({ ...current, loading: false }));
      Alert.alert('Erreur', error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `deps` is the caller's dependency list
  }, deps);

  useEffect(() => {
    mounted.current = true;
    reload();
    return () => {
      mounted.current = false;
    };
  }, [reload]);

  return { ...state, reload };
}

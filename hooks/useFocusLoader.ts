import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

type Result<T> = { data: T | null; error: string | null };
type State<T> = { data: T | null; loading: boolean; error: string | null };

/**
 * Loads data whenever the screen gains focus (so returning from another
 * screen shows fresh numbers). Keeps old data visible while refreshing.
 */
export function useFocusLoader<T>(load: () => Promise<Result<T>>) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const loadRef = useRef(load);
  loadRef.current = load;
  const requestId = useRef(0);

  const reload = useCallback(async () => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    const result = await loadRef.current();
    // Ignore responses from older requests that finished late.
    if (id !== requestId.current) return;
    setState((s) => ({
      data: result.error ? s.data : result.data,
      loading: false,
      error: result.error,
    }));
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  return { ...state, reload };
}

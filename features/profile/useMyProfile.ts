import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';

import { fetchMyProfile, type Profile } from './profileService';

type State = { profile: Profile | null; loading: boolean; error: string | null };

export function useMyProfile() {
  const { user } = useAuth();
  const userId = user?.id;
  const [state, setState] = useState<State>({ profile: null, loading: true, error: null });

  const load = useCallback(async () => {
    if (!userId) {
      setState({ profile: null, loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    const { data, error } = await fetchMyProfile(userId);
    setState({ profile: data, loading: false, error });
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}

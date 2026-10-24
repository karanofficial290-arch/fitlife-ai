import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { supabase } from '@/services/supabase';

import { shouldForgetSessionOnLaunch } from './rememberMe';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  /** True until the stored session has been restored from device storage. */
  initializing: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      // "Remember me" was off last time: end that session on this cold start.
      if (data.session && (await shouldForgetSessionOnLaunch())) {
        await supabase.auth.signOut({ scope: 'local' });
        return null;
      }
      return data.session;
    })()
      .then((restored) => {
        if (active) setSession(restored);
      })
      .catch(() => {
        // Corrupt or unreadable stored session: treat as signed out.
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setInitializing(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, user: session?.user ?? null, initializing }),
    [session, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>.');
  return context;
}

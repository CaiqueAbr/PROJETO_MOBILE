import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { api, type Session } from '../services/api';

type AuthContextValue = {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = 'moviehub.session';

function readSession(): Session | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? JSON.parse(value) as Session : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);

  async function saveSession(next: Session) {
    setSession(next);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    }
  }

  async function signIn(email: string, password: string) {
    await saveSession(await api.login({ email, password }));
  }

  async function signUp(name: string, email: string, password: string) {
    await saveSession(await api.register({ name, email, password }));
  }

  function signOut() {
    setSession(null);
    if (Platform.OS === 'web' && typeof window !== 'undefined') window.localStorage.removeItem(storageKey);
  }

  const value = useMemo(() => ({ session, signIn, signUp, signOut }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return value;
}

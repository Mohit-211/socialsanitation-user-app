import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { logOut } from '../api/account';
import { setSessionEndedHandler } from '../api/client';
import {
  clearSession,
  loadSession,
  saveSession,
  type Session,
} from '../api/session';
import { notify } from '../components/Toaster';

type Status = 'loading' | 'signedOut' | 'signedIn';

type SessionContextValue = {
  status: Status;
  /** Keeps a new session, after signing in or changing the password, and opens the app. */
  startSession: (session: Session) => Promise<void>;
  /** Ends the session on the server, then forgets it on this phone. */
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/** Knows whether the user is signed in, and switches the app between the two sets of screens. */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    loadSession()
      .then(session => setStatus(session ? 'signedIn' : 'signedOut'))
      .catch(() => setStatus('signedOut'));

    // The API ended the session: it expired, the password changed elsewhere, or the office
    // closed the account.
    setSessionEndedHandler(message => {
      clearSession().catch(() => undefined);
      setStatus('signedOut');
      notify.info(message);
    });
    return () => setSessionEndedHandler(null);
  }, []);

  const startSession = useCallback(async (session: Session) => {
    await saveSession(session);
    setStatus('signedIn');
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logOut();
    } catch {
      // Signed out on this phone either way.
    }
    await clearSession();
    setStatus('signedOut');
  }, []);

  const value = useMemo(
    () => ({ status, startSession, signOut }),
    [status, startSession, signOut],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used inside SessionProvider');
  }
  return value;
}

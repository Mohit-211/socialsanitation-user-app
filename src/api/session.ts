import * as Keychain from 'react-native-keychain';

/** The signed-in session. Its token goes in the x-access-token header of every client request. */
export type Session = { token: string; expiresAt: string | null };

// The token is kept in the iOS Keychain and in Keystore-encrypted storage on Android,
// never in plain app storage, and it does not move to a new phone with a backup.
const service = 'session';
const saveOptions = {
  service,
  accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
};

let current: Session | null = null;

/** The token of the session in use, for the API client. */
export const sessionToken = (): string | null => current?.token ?? null;

const isExpired = (session: Session) =>
  session.expiresAt !== null && Date.parse(session.expiresAt) <= Date.now();

const parse = (text: string): Session | null => {
  try {
    const value = JSON.parse(text) as Partial<Session>;
    return typeof value.token === 'string'
      ? { token: value.token, expiresAt: value.expiresAt ?? null }
      : null;
  } catch {
    return null;
  }
};

/** Reads the saved session at launch. An expired or unreadable one is deleted. */
export async function loadSession(): Promise<Session | null> {
  const saved = await Keychain.getGenericPassword({ service });
  const session = saved ? parse(saved.password) : null;
  if (!session || isExpired(session)) {
    await clearSession();
    return null;
  }
  current = session;
  return session;
}

/**
 * Uses the session at once and stores it for the next launch. If the phone refuses to store
 * it, the user stays signed in until the app closes rather than being unable to sign in.
 */
export async function saveSession(session: Session): Promise<void> {
  current = session;
  try {
    await Keychain.setGenericPassword(
      'client',
      JSON.stringify(session),
      saveOptions,
    );
  } catch {
    // Signed in for this run only; the next launch asks to sign in again.
  }
}

export async function clearSession(): Promise<void> {
  current = null;
  try {
    await Keychain.resetGenericPassword({ service });
  } catch {
    // Nothing was stored, or it can't be reached; the session is gone from memory either way.
  }
}

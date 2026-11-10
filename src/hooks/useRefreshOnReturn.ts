import { useEffect, useEffectEvent, useRef } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

/**
 * Calls `refresh` when the user comes back to this screen from another one, or back to the
 * app from elsewhere (such as the browser after paying), so what the screen shows is current.
 */
export function useRefreshOnReturn(refresh: () => void) {
  const onReturn = useEffectEvent(refresh);
  const isFocused = useIsFocused();
  const wasFocused = useRef(isFocused);

  useEffect(() => {
    if (isFocused && !wasFocused.current) {
      onReturn();
    }
    wasFocused.current = isFocused;
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    // iOS passes through "inactive" on the way back, so remember that the app left instead.
    let away = false;
    const subscription = AppState.addEventListener('change', next => {
      if (next === 'background') {
        away = true;
      } else if (next === 'active' && away) {
        away = false;
        onReturn();
      }
    });
    return () => subscription.remove();
  }, [isFocused]);
}

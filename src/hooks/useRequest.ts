import { useCallback, useEffect, useRef, useState } from 'react';
import { useRefreshOnReturn } from './useRefreshOnReturn';

type Status = 'loading' | 'refreshing' | 'idle';

/**
 * Loads what a screen shows. `load` must keep its identity between renders (wrap it in
 * useCallback); a new `load`, such as one for another ID, starts over. The data reloads
 * quietly when the user returns to the screen.
 */
export function useRequest<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();
  const [status, setStatus] = useState<Status>('loading');
  // Only the newest request may update the screen; older answers that arrive late are dropped.
  const latest = useRef(0);

  const run = useCallback(
    async (next: Status) => {
      const request = ++latest.current;
      setStatus(next);
      try {
        const result = await load();
        if (request === latest.current) {
          setData(result);
          setError(undefined);
        }
      } catch (e) {
        if (request === latest.current) {
          setError(e);
        }
      } finally {
        if (request === latest.current) {
          setStatus('idle');
        }
      }
    },
    [load],
  );

  useEffect(() => {
    setData(undefined);
    run('loading');
  }, [run]);

  useRefreshOnReturn(() => run('idle'));

  return {
    data,
    error,
    loading: status === 'loading',
    refreshing: status === 'refreshing',
    /** Tries again after an error, with the spinner. */
    reload: () => run('loading'),
    /** Pull to refresh. */
    refresh: () => run('refreshing'),
  };
}

export type Request<T> = ReturnType<typeof useRequest<T>>;

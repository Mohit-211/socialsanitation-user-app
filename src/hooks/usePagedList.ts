import { useCallback, useEffect, useRef, useState } from 'react';
import type { Paged } from '../api/types';
import { errorMessage } from '../api/errors';
import { notify } from '../components/Toaster';
import { useRefreshOnReturn } from './useRefreshOnReturn';

type Status = 'loading' | 'refreshing' | 'more' | 'idle';

/**
 * A list the API sends a page at a time. `loadPage` must keep its identity between renders;
 * a new one (another filter) starts over from page 1. Returning to the screen reloads page 1.
 */
export function usePagedList<T extends { id: number }>(
  loadPage: (page: number) => Promise<Paged<T>>,
) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [error, setError] = useState<unknown>();
  const [status, setStatus] = useState<Status>('loading');
  const latest = useRef(0);

  const fetchPage = useCallback(
    async (page: number, next: Status) => {
      const request = ++latest.current;
      setStatus(next);
      try {
        const result = await loadPage(page);
        if (request !== latest.current) {
          return;
        }
        // Items can shift between pages while the user scrolls; skip any already shown.
        setItems(shown =>
          page === 1
            ? result.items
            : [
                ...shown,
                ...result.items.filter(
                  item => !shown.some(s => s.id === item.id),
                ),
              ],
        );
        setTotal(result.pagination.total);
        setNextPage(page < result.pagination.total_pages ? page + 1 : null);
        setError(undefined);
      } catch (e) {
        if (request !== latest.current) {
          return;
        }
        if (page === 1) {
          setError(e);
        } else {
          notify.error(errorMessage(e));
        }
      } finally {
        if (request === latest.current) {
          setStatus('idle');
        }
      }
    },
    [loadPage],
  );

  useEffect(() => {
    setItems([]);
    setNextPage(null);
    fetchPage(1, 'loading');
  }, [fetchPage]);

  useRefreshOnReturn(() => fetchPage(1, 'idle'));

  return {
    items,
    /** The total count across all pages. */
    total,
    error,
    loading: status === 'loading',
    refreshing: status === 'refreshing',
    loadingMore: status === 'more',
    reload: () => fetchPage(1, 'loading'),
    refresh: () => fetchPage(1, 'refreshing'),
    loadMore: () => {
      if (nextPage !== null && status === 'idle') {
        fetchPage(nextPage, 'more');
      }
    },
    /** Takes an item out of the list straight away, such as a notification just marked read. */
    remove: (id: number) => {
      setItems(shown => shown.filter(item => item.id !== id));
      setTotal(count => Math.max(0, count - 1));
    },
  };
}

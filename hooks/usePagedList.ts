import { useCallback, useEffect, useRef, useState } from 'react';

type Result<T> = { data: T[] | null; error: string | null };

/**
 * Page-by-page loader for FlatLists. `fetchPage` must return at most
 * `pageSize` rows; a shorter page means the end was reached.
 * Changing `fetchPage` (e.g. a new filter) restarts from page 0.
 */
export function usePagedList<T>(fetchPage: (page: number) => Promise<Result<T>>, pageSize: number) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const generation = useRef(0);

  const loadPage = useCallback(
    async (pageToLoad: number) => {
      const gen = generation.current;
      setLoading(true);
      setError(null);
      const result = await fetchPage(pageToLoad);
      if (gen !== generation.current) return; // filter changed meanwhile
      setLoading(false);
      if (result.error || !result.data) {
        setError(result.error ?? 'Load nahi ho paaya.');
        return;
      }
      const rows = result.data;
      setItems((prev) => (pageToLoad === 0 ? rows : [...prev, ...rows]));
      setPage(pageToLoad);
      setDone(rows.length < pageSize);
    },
    [fetchPage, pageSize],
  );

  useEffect(() => {
    generation.current += 1;
    setItems([]);
    setDone(false);
    void loadPage(0);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (loading || done || error) return;
    void loadPage(page + 1);
  }, [loading, done, error, loadPage, page]);

  const retry = useCallback(() => {
    void loadPage(items.length === 0 ? 0 : page + 1);
  }, [loadPage, items.length, page]);

  const refresh = useCallback(() => {
    generation.current += 1;
    setDone(false);
    void loadPage(0);
  }, [loadPage]);

  return { items, loading, error, done, loadMore, retry, refresh };
}

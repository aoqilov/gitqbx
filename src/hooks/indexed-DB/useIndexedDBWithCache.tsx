// hooks/indexed-DB/useIndexedDBWithCache.ts
import { useEffect, useState } from "react";
import { useIndexedDB } from "./useIndexedDB";
import { LocalRecord } from "./types";

// ─── Global cache — barcha hooklar uchun umumiy ───────────────────────────────
const cache = new Map<string, unknown[]>();

interface UseIndexedDBWithCacheOptions<T> {
  dbName: string;
  storeName: string;
  filterKey?: keyof T;
  filterValue?: number | string | null;
}

export function useIndexedDBWithCache<T extends LocalRecord>({
  dbName,
  storeName,
  filterKey,
  filterValue,
}: UseIndexedDBWithCacheOptions<T>) {
  const { getAll, isReady } = useIndexedDB<T>({ dbName, storeName });

  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cache key — store + filter kombinatsiyasi
  const cacheKey = `${storeName}__${String(filterKey)}__${filterValue}`;

  useEffect(() => {
    if (!isReady) return;
    if (filterValue == null) return;

    // Cache hit → loading yo'q
    if (cache.has(cacheKey)) {
      setData(cache.get(cacheKey) as T[]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getAll()
      .then((all) => {
        const filtered =
          filterKey != null
            ? all.filter((item) => item[filterKey] === filterValue)
            : all;

        cache.set(cacheKey, filtered); // ← cache ga yoz
        setData(filtered);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isReady, cacheKey, filterKey, filterValue, getAll]);

  // Manuel cache tozalash (kerak bo'lganda)
  const invalidate = () => {
    cache.delete(cacheKey);
  };

  return { data, isLoading, invalidate };
}

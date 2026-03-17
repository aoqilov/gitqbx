import { useCallback, useEffect, useRef, useState } from "react";
import { createDB } from "./db";
import { DBConfig, LocalRecord } from "./types";

export function useIndexedDB<T extends LocalRecord>(config: DBConfig) {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  });

  useEffect(() => {
    let cancelled = false;

    createDB(configRef.current)
      .then((database) => {
        if (!cancelled) {
          setDb(database);
          setIsReady(true);
        }
      })
      .catch((err) => {
        console.error("[useIndexedDB] DB ochishda xato:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const add = useCallback(
    (data: T): Promise<IDBValidKey> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error("DB hali tayyor emas"));
          return;
        }

        const tx = db.transaction(configRef.current.storeName, "readwrite");
        const store = tx.objectStore(configRef.current.storeName);
        const req = store.add(data);

        req.onsuccess = () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("indexeddb:change", {
                detail: { storeName: configRef.current.storeName },
              }),
            );
          }
          resolve(req.result);
        };
        req.onerror = () => reject(req.error);
      });
    },
    [db],
  );

  const edit = useCallback(
    (data: T): Promise<IDBValidKey> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error("DB hali tayyor emas"));
          return;
        }

        const tx = db.transaction(configRef.current.storeName, "readwrite");
        const store = tx.objectStore(configRef.current.storeName);
        const req = store.put(data);

        req.onsuccess = () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("indexeddb:change", {
                detail: { storeName: configRef.current.storeName },
              }),
            );
          }
          resolve(req.result);
        };
        req.onerror = () => reject(req.error);
      });
    },
    [db],
  );

  const remove = useCallback(
    (local_id: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error("DB hali tayyor emas"));
          return;
        }

        const tx = db.transaction(configRef.current.storeName, "readwrite");
        const store = tx.objectStore(configRef.current.storeName);
        const req = store.delete(local_id);

        req.onsuccess = () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("indexeddb:change", {
                detail: { storeName: configRef.current.storeName },
              }),
            );
          }
          resolve();
        };
        req.onerror = () => reject(req.error);
      });
    },
    [db],
  );

  const get = useCallback(
    (local_id: number): Promise<T | undefined> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error("DB hali tayyor emas"));
          return;
        }

        const tx = db.transaction(configRef.current.storeName, "readonly");
        const store = tx.objectStore(configRef.current.storeName);
        const req = store.get(local_id);

        req.onsuccess = () => resolve(req.result as T | undefined);
        req.onerror = () => reject(req.error);
      });
    },
    [db],
  );

  const getAll = useCallback((): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error("DB hali tayyor emas"));
        return;
      }

      const tx = db.transaction(configRef.current.storeName, "readonly");
      const store = tx.objectStore(configRef.current.storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }, [db]);

  return {
    isReady,
    add,
    edit,
    remove,
    get,
    getAll,
  };
}

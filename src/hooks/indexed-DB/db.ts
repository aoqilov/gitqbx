import {
  DEVICE_DB_NAME,
  DEVICE_DB_STORES,
  DEVICE_DB_VERSION,
} from "./deviceDB.config";
import { DBConfig } from "./types";

export const createDB = ({
  dbName,
  storeName,
  version,
  keyPath = "id",
}: DBConfig): Promise<IDBDatabase> => {
  // "deviceDB" uchun markaziy config ishlatiladi —
  // barcha store-lar bir upgrade ichida yaratiladi
  const isDeviceDB = dbName === DEVICE_DB_NAME;
  const resolvedVersion = version ?? (isDeviceDB ? DEVICE_DB_VERSION : 1);

  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, resolvedVersion);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (isDeviceDB) {
        // Barcha belgilangan store-larni yaratamiz.
        // Agar store allaqachon boshqa keyPath bilan mavjud bo'lsa —
        // o'chirib qayta yaratamiz (keyPath o'zgartirilganda kerak).
        DEVICE_DB_STORES.forEach(
          ({
            storeName: name,
            keyPath: kp = "local_id",
            autoIncrement = false,
          }) => {
            if (db.objectStoreNames.contains(name)) {
              db.deleteObjectStore(name);
            }
            db.createObjectStore(name, { keyPath: kp, autoIncrement });
          },
        );
      } else {
        // Boshqa DB-lar uchun oddiy yagona store yaratish
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath,
            autoIncrement: true,
          });
        }
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

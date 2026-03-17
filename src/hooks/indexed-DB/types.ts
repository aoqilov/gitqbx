export interface StoreSchema {
  storeName: string;
  keyPath?: string;
  autoIncrement?: boolean;
}

export interface DBConfig {
  dbName: string;
  storeName: string;
  version?: number;
  keyPath?: string;
}

/**
 * IndexedDB da saqlanadigan har bir yozuv uchun asosiy tip.
 *
 * - `local_id` — IDB ichidagi kalit (keyPath). get/add/edit/delete shu orqali ishlaydi.
 * - `id`       — serverdan kelgan haqiqiy ID. Hozircha null, kelajakda sync uchun ishlatiladi.
 */
export interface LocalRecord {
  project?: number;
  local_id: number;
  id: string | null;
}

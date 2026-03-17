import { LocalRecord } from "@/hooks/indexed-DB/types";

// IndexedDB uchun status type  (LocalRecord: local_id + id)
export type StatusForIndexedDB = LocalRecord & {
  // local_id: number — IDB keyPath  (LocalRecord dan keladi)
  // id: string | null — server ID, hozircha null (LocalRecord dan keladi)
  project: number;
  name: string;
  color: string;
  priority: number;
};

// ✅ Ikkala source (IndexedDB + REST API) uchun umumiy normalized type
export type NormalizedStatus = {
  uid: number | string; // IDB: local_id | API: id
  name: string;
  color: string;
  priority: number;
  _raw: StatusForIndexedDB | ProjectStatus; // original objectni saqlaymiz
};

// ✅ Mapperlar
export const fromStatusIDB = (s: StatusForIndexedDB): NormalizedStatus => ({
  uid: s.local_id,
  name: s.name,
  color: s.color,
  priority: s.priority,
  _raw: s,
});

export const fromStatusAPI = (s: ProjectStatus): NormalizedStatus => ({
  uid: s.id,
  name: s.name,
  color: s.color,
  priority: s.priority,
  _raw: s,
});

// ✅ UID extractor
export const getStatusUID = (
  item: StatusForIndexedDB | ProjectStatus,
): number | string => ("local_id" in item ? item.local_id : item.id);

import { LocalRecord } from "@/hooks/indexed-DB/types";

// IndexedDB uchun tag type (LocalRecord: local_id + id)
export type TagForIndexedDB = LocalRecord & {
  // local_id: number — IDB keyPath (LocalRecord dan keladi)
  // id: string | null — server ID, hozircha null (LocalRecord dan keladi)
  project: number;
  tag_group: number;
  name: string;
  color: string;
  priority: number;
};

// ✅ Ikkala source (IndexedDB + REST API) uchun umumiy normalized type
export type NormalizedTag = {
  uid: number | string; // IDB: local_id | API: id
  name: string;
  color: string;
  priority: number;
  _raw: TagForIndexedDB | ProjectTag;
};

// ✅ Mapperlar
export const fromTagIDB = (t: TagForIndexedDB): NormalizedTag => ({
  uid: t.local_id,
  name: t.name,
  color: t.color,
  priority: t.priority,
  _raw: t,
});

export const fromTagAPI = (t: ProjectTag): NormalizedTag => ({
  uid: t.id,
  name: t.name,
  color: t.color,
  priority: t.priority ?? 0,
  _raw: t,
});

// ✅ UID extractor
export const getTagUID = (
  item: TagForIndexedDB | ProjectTag,
): number | string => ("local_id" in item ? item.local_id : item.id);

import { LocalRecord } from "@/hooks/indexed-DB/types";

// IndexedDB uchun tag group type
export type TagGroupForIndexedDB = LocalRecord & {
  // local_id: number  — IDB keyPath  (LocalRecord dan keladi)
  // id: string | null — server ID, hozircha null (LocalRecord dan keladi)
  project: number;
  name: string;
};

// ✅ Ikkala source (IndexedDB + REST API) uchun umumiy normalized type
export type NormalizedTagGroup = {
  uid: number | string; // IDB: local_id | API: id
  name: string;
  _raw: TagGroupForIndexedDB | ProjectTagGroup;
};

// ✅ Mapperlar
export const fromTagGroupIDB = (
  g: TagGroupForIndexedDB,
): NormalizedTagGroup => ({
  uid: g.local_id,
  name: g.name,
  _raw: g,
});

export const fromTagGroupAPI = (g: ProjectTagGroup): NormalizedTagGroup => ({
  uid: g.id,
  name: g.name,
  _raw: g,
});

// ✅ UID extractor
export const getTagGroupUID = (
  item: TagGroupForIndexedDB | ProjectTagGroup,
): number | string => ("local_id" in item ? item.local_id : item.id);

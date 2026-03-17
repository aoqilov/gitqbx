import { LocalRecord } from "@/hooks/indexed-DB/types";

// IndexedDB uchun theme type
export type ThemeForIndexedDB = LocalRecord & {
  // local_id: number  — IDB keyPath  (LocalRecord dan keladi)
  // id: string | null — server ID, hozircha null (LocalRecord dan keladi)
  project: number;
  name: string;
  /** iconList.index bo'yicha icon raqami */
  icon: number;
  createdAt: number;
};

// ✅ Ikkala source (IndexedDB + REST API) uchun umumiy normalized type
export type NormalizedTheme = {
  uid: number | string; // IDB: local_id | API: id
  name: string;
  icon: number;
  _raw: ThemeForIndexedDB | ProjectTheme;
};

// ✅ Mapperlar
export const fromThemeIDB = (t: ThemeForIndexedDB): NormalizedTheme => ({
  uid: t.local_id,
  name: t.name,
  icon: t.icon,
  _raw: t,
});

export const fromThemeAPI = (t: ProjectTheme): NormalizedTheme => ({
  uid: t.id,
  name: t.name,
  icon: t.icon ?? 0,
  _raw: t,
});

// ✅ UID extractor
export const getThemeUID = (
  item: ThemeForIndexedDB | ProjectTheme,
): number | string => ("local_id" in item ? item.local_id : item.id);

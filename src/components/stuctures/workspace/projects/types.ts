import { LocalRecord } from "@/hooks/indexed-DB/types";

// ✅ Ikkala source (IndexedDB + REST API) uchun umumiy normalized type
export type NormalizedProject = {
  uid: number | string; // local_id | id
  name: string;
  _raw: ProjectForIndexedDB | Project; // original objectni saqlaymiz
};

// ✅ Mapperlar
export const fromIDB = (p: ProjectForIndexedDB): NormalizedProject => ({
  uid: p.local_id,
  name: p.name,
  _raw: p,
});

export const fromAPI = (p: Project): NormalizedProject => ({
  uid: p.id,
  name: p.name,
  _raw: p,
});

// ✅ UID extractor
export const getUID = (item: ProjectForIndexedDB | Project): number | string =>
  "local_id" in item ? item.local_id : item.id;

//
export type ProjectForIndexedDB = LocalRecord & {
  name: string;
  attachment_employee: boolean;
  auto_renewal: boolean;
  encapsulation_tasks: boolean;
  future_execution: boolean;
  members: any[];
  roles: any[];
  statuses: any[];
  tagsGroup: any[];
  themes: any[];
};

import { StoreSchema } from "./types";

/**
 * "deviceDB" uchun markaziy config.
 *
 * MUHIM: Yangi store qo'shilganda:
 *   1) stores[] ga qo'shing
 *   2) DEVICE_DB_VERSION ni 1 ga oshiring
 *
 * Versiyani oshirmasangiz — onupgradeneeded ishlamaydi,
 * yangi store HECH QACHON yaratilmaydi.
 */
export const DEVICE_DB_NAME = "deviceDB";
export const DEVICE_DB_VERSION = 4;

export const DEVICE_DB_STORES: StoreSchema[] = [
  { storeName: "projects", keyPath: "local_id", autoIncrement: false },
  { storeName: "statuses", keyPath: "local_id", autoIncrement: false },
  { storeName: "tagGroup", keyPath: "local_id", autoIncrement: false },
  { storeName: "tags", keyPath: "local_id", autoIncrement: false },
  { storeName: "theme", keyPath: "local_id", autoIncrement: false },
  { storeName: "tasks", keyPath: "local_id", autoIncrement: false },
  { storeName: "subtasks", keyPath: "local_id", autoIncrement: false },
];

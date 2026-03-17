// permissionList.ts

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export const permissionList: Permission[] = [
  {
    id: 1,
    name: "CREATE_USER",
    description: "Foydalanuvchi yaratish",
  },
  {
    id: 2,
    name: "EDIT_USER",
    description: "Foydalanuvchini tahrirlash",
  },
  {
    id: 3,
    name: "DELETE_USER",
    description: "Foydalanuvchini o‘chirish",
  },
  {
    id: 4,
    name: "VIEW_DASHBOARD",
    description: "Dashboardni ko‘rish",
  },
];

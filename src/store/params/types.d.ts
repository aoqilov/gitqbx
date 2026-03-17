type MenuMode = "default" | "profile" | "settings" | "family" | "organization";
declare interface TaskProgress {
  total: number;
  completed: number;
}
declare interface ParamsSlice {
  serverIP: string;
  language: string;
  menuMode: MenuMode;
  workspaceName: string;
  workspaceMode: import("./enums").WorkspaceMode;
  projectNameForHeader: string;
  projectNameForHeader2: string;
  taskProgress: TaskProgress;
  payment: boolean;
}

declare interface ProjectRolesState {
  byProjectId: Record<number, ProjectRole[]>;
}

declare interface ProjectRole {
  id: number;
  workspace: number;
  name: string;
  permissions: number[];
}

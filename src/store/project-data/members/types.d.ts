declare interface ProjectMembersState {
  list: ProjectMember[];
}

declare interface ProjectMember {
  id: number;
  user: number;
  workspace: number;
  project: number;
  team: number;
  type: string;
  isOwner: boolean;
  role: number;
  permissions: number[];
  total_tasks_count: number;
  completed_tasks_count: number;
  uncompleted_tasks_count: number;
}

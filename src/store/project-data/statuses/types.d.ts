declare interface ProjectStatusesState {
  byProjectId: Record<number, ProjectStatus[]>;
}

declare interface ProjectStatus {
  id: number;
  project: number;
  name: string;
  color: string;
  priority: number;
}

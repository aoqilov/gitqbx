declare interface ProjectsState {
  list: Project[];
  loading: boolean;
  error?: string;
}
declare interface Project {
  id: number;
  workspace: number;
  name: string;
  auto_renewal: boolean;
  future_execution: boolean;
  encapsulation_tasks: boolean;
  attachment_employee: boolean;
  //
  members: ProjectMember[];
  themes: ProjectTheme[];
  tagsGroup: ProjectTagGroup[];
  statuses: ProjectStatus[];
  roles: ProjectRole[];
}

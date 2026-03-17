declare interface ProjectThemesState {
  byProjectId: Record<number, ProjectTheme[]>;
}

declare interface ProjectTheme {
  id: number;
  project: number;
  name: string;
  icon: number;
}

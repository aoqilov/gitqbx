declare interface ProjectTagsState {
  byProjectTagsGroupId: Record<number, ProjectTagGroup[]>;
  byProjectTagId: Record<number, ProjectTag[]>;
}

declare interface ProjectTagGroup {
  id: number;
  project: number;
  name: string;
  tags: ProjectTag[];
}

declare interface ProjectTag {
  id: number;
  project: number;
  tag_group: number;
  name: string;
  color: string;
  priority: number;
}

import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export const useGetStoreDataByProjectId = (projectId: number) => {
  const members = useSelector((state: RootState) =>
    state.projectMembers.list.filter((m) => m.project === projectId),
  );

  const roles = useSelector(
    (state: RootState) => state.projectRoles.byProjectId[projectId] ?? [],
  );

  const tagsGroup = useSelector(
    (state: RootState) =>
      state.projectTags.byProjectTagsGroupId[projectId] ?? [],
  );

  const tags = useSelector((state: RootState) =>
    (state.projectTags.byProjectTagsGroupId[projectId] ?? []).flatMap(
      (group) => group.tags,
    ),
  );

  const status = useSelector(
    (state: RootState) => state.projectStatuses.byProjectId[projectId] ?? [],
  );

  const theme = useSelector(
    (state: RootState) => state.projectThemes.byProjectId[projectId] ?? [],
  );

  return { members, roles, tagsGroup, tags, status, theme };
};

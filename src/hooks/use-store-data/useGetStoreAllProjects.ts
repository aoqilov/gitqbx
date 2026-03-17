import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export const useGetStoreAllProjects = () => {
  const members = useSelector((state: RootState) => state.projectMembers.list);

  const roles = useSelector(
    (state: RootState) => state.projectRoles.byProjectId,
  );

  const tagsGroup = useSelector(
    (state: RootState) => state.projectTags.byProjectTagsGroupId,
  );

  const tags = useSelector((state: RootState) =>
    Object.values(state.projectTags.byProjectTagsGroupId)
      .flat()
      .flatMap((group) => group.tags),
  );

  const status = useSelector(
    (state: RootState) => state.projectStatuses.byProjectId,
  );

  const theme = useSelector(
    (state: RootState) => state.projectThemes.byProjectId,
  );

  return { members, roles, tagsGroup, tags, status, theme };
};

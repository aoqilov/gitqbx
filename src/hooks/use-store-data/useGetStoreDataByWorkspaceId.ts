import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export const useGetStoreDataByWorkspaceId = (workspaceId: number) => {
  const members = useSelector((state: RootState) =>
    state.members.list.filter((m) => m.workspace === workspaceId),
  );

  const roles = useSelector((state: RootState) =>
    state.roles.list.filter((r) => r.workspace === workspaceId),
  );

  const projects = useSelector((state: RootState) =>
    state.projects.list.filter((p) => p.workspace === workspaceId),
  );

  return { members, roles, projects };
};

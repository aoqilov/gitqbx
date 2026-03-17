import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export const useGetStoreAllWorkspace = () => {
  const members = useSelector((state: RootState) => state.members.list);

  const roles = useSelector((state: RootState) => state.roles.list);

  const projects = useSelector((state: RootState) => state.projects.list);

  const teams = useSelector((state: RootState) => state.teams.list);

  return { members, roles, projects, teams };
};

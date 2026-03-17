// src/hooks/useRouteParams.ts
import { useParams } from "react-router-dom";

export const globalParams = () => {
  const { workspaceID, projectID, tagGroupID } = useParams<{
    workspaceID?: string;
    projectID?: string;
    tagGroupID?: string;
  }>();

  return {
    workspaceID,
    projectID,
    tagGroupID,
  };
};

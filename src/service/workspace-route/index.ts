import { api } from "@/plugin/axios/axios";

// ================================================================================================//= [- INTERFACE -]
export interface WorkspaceResponse {
  workspaces: Workspace[];
}

export interface Workspace {
  id: number;
  owner: number;
  type: "organization" | "personal" | string;
  name: string;
  billing_plan: boolean;
  projects: Project[];
  roles: Role[];
  members: Member[];
}

// =================================================================================================//= [- GET   -]
export async function getWorkspaces({
  type,
}: {
  type?: "organization" | "device" | "family";
}) {
  const response = await api.get<WorkspaceResponse>(`/workspaces`, {
    params: {
      type,
    },
  });
  return response.data;
}
// =================================================================================================//= [- POST  -]
// =================================================================================================//= [- DELETE-]
// =================================================================================================//= [- PUT   -]
export async function putWorkspace({
  workspaceID,
  name,
}: {
  workspaceID: string;
  name: string;
}): Promise<WorkspaceResponse | any> {
  try {
    const response = await api.put(`/workspace/${workspaceID}`, {
      params: {
        name,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating workspace:", error);
    throw error;
  }
}

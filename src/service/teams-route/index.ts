import { api } from "@/plugin/axios/axios";

// =================================================================================================//= [- GET   -]
export async function getTeams({
  workspaceID,
}: {
  workspaceID: string;
}): Promise<TeamsResponse | undefined> {
  try {
    const response = await api.get(`/workspaces/${workspaceID}/teams`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return undefined;
  }
}
// =================================================================================================//= [- POST  -]
export async function postTeam({
  workspaceID,
  data,
}: {
  workspaceID: string;
  data: {
    name: string;
    users: number[];
  };
}) {
  try {
    const response = await api.post(`/workspaces/${workspaceID}/teams`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating team:", error);
    return undefined;
  }
}

// =================================================================================================//= [- DELETE-]
export async function deleteTeam({
  workspaceID,
  teamID,
}: {
  workspaceID: string;
  teamID: number;
}) {
  try {
    const response = await api.delete(
      `/workspaces/${workspaceID}/teams/${Number(teamID)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting team:", error);
    return undefined;
  }
}

// =================================================================================================//= [- PUT   -]
export async function putTeam({
  workspaceID,
  teamID,
  data,
}: {
  workspaceID: string;
  teamID: number;
  data: {
    name?: string;
    users?: number[];
  };
}) {
  try {
    const response = await api.put(
      `/workspaces/${workspaceID}/teams/${teamID}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating team:", error);
    return undefined;
  }
}

import { api } from "@/plugin/axios/axios";

// =================================================================================================//= [- GET   -]
export async function getProjectStatuses({
  projectID,
}: {
  projectID: string;
}): Promise<ProjectStatus[]> {
  const response = await api.get(`/projects/${projectID}/status`);
  return response.data;
}
// =================================================================================================//= [- POST  -]
export async function createProjectStatus({
  projectID,
  data,
}: {
  projectID: string;
  data: {
    name: string;
    color: string;
  };
}): Promise<ProjectStatus> {
  try {
    const response = await api.post(`/projects/${projectID}/status`, data);
    const result = response.data;
    // Backend { status: ProjectStatus } yoki ProjectStatus qaytarishi mumkin
    return result?.status ?? result;
  } catch (error) {
    console.error("Error creating project status:", error);
    throw error;
  }
}
// =================================================================================================//= [- DELETE-]
export async function deleteProjectStatus({
  projectID,
  statusID,
}: {
  projectID: string;
  statusID: string;
}) {
  try {
    const response = await api.delete(
      `/projects/${projectID}/status/${statusID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting project status:", error);
    throw error;
  }
}
// =================================================================================================//= [- PUT   -]
export async function updateProjectStatus({
  projectID,
  statusID,
  data,
}: {
  projectID: string;
  statusID: string;
  data: {
    name: string;
    color: string;
    priority: number;
  };
}): Promise<ProjectStatus> {
  try {
    const response = await api.put(
      `/projects/${projectID}/status/${statusID}`,
      data,
    );
    const result = response.data;
    return result?.status ?? result;
  } catch (error) {
    console.error("Error updating project status:", error);
    throw error;
  }
}
// =================================================================================================//= [- PATCH  -]
export async function patchProjectStatusPriority({
  projectID,
  statusID,
  priority,
}: {
  projectID: string;
  statusID: number;
  priority: number;
}): Promise<ProjectStatus> {
  try {
    const response = await api.patch(
      `/projects/${projectID}/status/${statusID}`,
      { priority },
    );
    const result = response.data;
    return result?.status ?? result;
  } catch (error) {
    console.error("Error patching project status priority:", error);
    throw error;
  }
}

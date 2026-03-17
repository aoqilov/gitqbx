import { api } from "@/plugin/axios/axios";
// =================================================  INTERFACE =================================================

export interface ProjectsResponse {
  projects: Project[];
}

// =================================================  GET =================================================
export async function getProjects(workspaceID: string) {
  const response = await api.get<ProjectsResponse>(
    `/workspaces/${workspaceID}/projects`,
  );
  return response.data;
}

// =================================================  POST =================================================
export interface PostProjectPayload {
  name: string;
}

export async function postProject(
  workspaceID: string,
  data: PostProjectPayload,
) {
  const response = await api.post<Project>(
    `/workspaces/${workspaceID}/projects`,
    data,
  );
  return response.data;
}
// =================================================  DELETE =================================================
export async function deleteProject(workspaceID: string, projectID: string) {
  const response = await api.delete(
    `/workspaces/${workspaceID}/projects/${projectID}`,
  );
  return response.data;
}
// =================================================  PUT =================================================
export async function putProject(
  workspaceID: string,
  projectID: string | number,
  data: PostProjectPayload,
) {
  const response = await api.put<Project>(
    `/workspaces/${workspaceID}/projects/${projectID}`,
    data,
  );
  return response.data;
}

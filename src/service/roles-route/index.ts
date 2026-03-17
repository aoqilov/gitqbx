import { api } from "@/plugin/axios/axios";

// =================================================================================================//= [- GET   -]
// =================================================================================================//= [- POST  -]
export async function postRoleWorkspace({
  workspaceID,
  data,
}: {
  workspaceID: string;
  data: { name: string; permissions: number[] };
}): Promise<Role | undefined> {
  try {
    const response = await api.post(`/workspaces/${workspaceID}/roles`, {
      ...data,
    });
    const result = response.data;
    return result?.roles ?? result;
  } catch (error) {
    console.error("Error creating role:", error);
  }
}
export async function postRoleProject({
  projectID,
  data,
}: {
  projectID: string;
  data: { name: string; permissions: number[] };
}): Promise<Role | undefined> {
  try {
    const response = await api.post(`/projects/${projectID}/roles`, {
      ...data,
    });
    const result = response.data;
    return result?.roles ?? result;
  } catch (error) {
    console.error("Error creating role:", error);
  }
}
// =================================================================================================//= [- DELETE-]
export async function deleteRoleById(roleID: number) {
  try {
    const response = await api.delete(`/roles/${roleID}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting role:", error);
  }
}
// =================================================================================================//= [- PUT   -]
export async function putRoleWorkspace({
  roleID,
  data,
}: {
  roleID: number;
  data: { name: string; permissions: number[] };
}): Promise<Role | undefined> {
  try {
    const response = await api.put(`/roles/${roleID}`, {
      ...data,
    });
    const result = response.data;
    return result?.roles ?? result;
  } catch (error) {
    console.error("Error updating role:", error);
  }
}

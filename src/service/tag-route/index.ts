import { api } from "@/plugin/axios/axios";

// =================================================================================================//= [- GET   -]
// =================================================================================================//= [- POST  -]
export async function postTag({
  tagGroupID,
  projectID,
  data,
}: {
  tagGroupID: number;
  projectID: string;
  data: { name: string; color: string; tagGroupID?: number };
}): Promise<ProjectTag | undefined> {
  try {
    const response = await api.post(
      `/projects/${projectID}/tagGroups/${tagGroupID}/tags`,
      {
        ...data,
      },
    );
    const result = response.data;
    return result?.tags ?? result;
  } catch (error) {
    console.error("Error creating tag:", error);
  }
}
// =================================================================================================//= [- DELETE-]
export async function deleteTagById({
  tagID,
  tagGroupID,
  projectID,
}: {
  tagID: number;
  tagGroupID: number;
  projectID: string;
}) {
  try {
    const response = await api.delete(
      `/projects/${projectID}/tagGroups/${tagGroupID}/tags/${tagID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting tag:", error);
  }
}
// =================================================================================================//= [- PUT   -]
export async function putTag({
  tagID,
  tagGroupID,
  projectID,
  data,
}: {
  tagID: number;
  tagGroupID: number;
  projectID: string;
  data: { name: string; color: string; tagGroupID?: number };
}): Promise<ProjectTag | undefined> {
  try {
    const response = await api.put(
      `/projects/${projectID}/tagGroups/${tagGroupID}/tags/${tagID}`,
      {
        ...data,
      },
    );
    const result = response.data;
    return result?.tags ?? result;
  } catch (error) {
    console.error("Error updating tag:", error);
  }
}

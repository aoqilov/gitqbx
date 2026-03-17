import { api } from "@/plugin/axios/axios";
// ------------------------- INTERFACES
interface ResponeseTagsGroup {
  tagGroups: ProjectTagGroup[];
}

// =================================================================================================//= [- GET   -]
export async function getTagsGroupByProjectID(projectID: string) {
  try {
    const response = await api.get<ResponeseTagsGroup>(
      `/projects/${projectID}/tagGroups`,
    );
    const result = response.data;
    return result?.tagGroups ?? result;
  } catch (error) {
    console.error("Error fetching tags group:", error);
  }
}
// =================================================================================================//= [- POST  -]
export async function postTagsGroup({
  projectID,
  data,
}: {
  projectID: string;
  data: { name: string };
}): Promise<ProjectTagGroup | undefined> {
  try {
    const response = await api.post(`/projects/${projectID}/tagGroups`, {
      ...data,
    });
    const result = response.data;
    return result?.tagGroups ?? result;
  } catch (error) {
    console.error("Error creating tags group:", error);
  }
}

// =================================================================================================//= [- DELETE-]
export async function deleteTagsGroupById({
  tagGroupID,
  projectID,
}: {
  tagGroupID: number;
  projectID: string;
}) {
  try {
    const response = await api.delete(
      `/projects/${projectID}/tagGroups/${tagGroupID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting tags group:", error);
  }
}
// =================================================================================================//= [- PUT   -]
export async function putTagsGroup({
  tagGroupID,
  projectID,
  data,
}: {
  tagGroupID: number;
  projectID: string;
  data: { name: string };
}): Promise<ProjectTagGroup | undefined> {
  try {
    const response = await api.put(
      `/projects/${projectID}/tagGroups/${tagGroupID}`,
      {
        ...data,
      },
    );
    const result = response.data;
    return result?.tagGroups ?? result;
  } catch (error) {
    console.error("Error updating tags group:", error);
  }
}

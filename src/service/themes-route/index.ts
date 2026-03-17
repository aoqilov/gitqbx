import { api } from "@/plugin/axios/axios";

interface ProjectThemeResponse {
  themes: ProjectTheme[];
}

// =================================================================================================//= [- GET   -]
export async function getThemes({
  projectID,
}: {
  projectID: string | number;
}): Promise<ProjectThemeResponse | undefined> {
  try {
    const response = await api.get(`/projects/${projectID}/themes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching themes:", error);
    throw error;
  }
}
// =================================================================================================//= [- POST  -]
export async function postTheme({
  projectID,
  data,
}: {
  projectID: string | number;
  data: {
    name: string;
    icon: number; // icon ID
  };
}): Promise<ProjectTheme | undefined> {
  try {
    const response = await api.post(`/projects/${projectID}/themes`, data);
    const result = response.data;
    // Server: { themes: {...} } qaytaradi
    return result?.themes ?? result;
  } catch (error) {
    console.error("Error creating theme:", error);
    throw error;
  }
}
// =================================================================================================//= [- DELETE-]
export async function deleteTheme({
  projectID,
  themeID,
}: {
  projectID: string | number;
  themeID: number;
}) {
  try {
    const response = await api.delete(
      `/projects/${projectID}/themes/${themeID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting theme:", error);
    throw error;
  }
}

// ==================================================================================================//= [- PUT   -]
export async function putTheme({
  projectID,
  themeID,
  data,
}: {
  projectID: string | number;
  themeID: number;
  data: {
    name: string;
    icon: number; // icon ID
  };
}): Promise<ProjectTheme | undefined> {
  try {
    const response = await api.put(
      `/projects/${projectID}/themes/${themeID}`,
      data,
    );
    const result = response.data;
    return result?.themes ?? result;
  } catch (error) {
    console.error("Error updating theme:", error);
    throw error;
  }
}

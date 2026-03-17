import { api } from "@/plugin/axios/axios";

// =============================== INTERFACE ===============================
export interface postTaskPayload {
  content: string;
  performers: number[];
  teams: number[];
  expiredAt: string; // YYYY-MM-DD HH:mm
  tags: number[];
  theme: number;
  parent: number;
  createdAt: string; // YYYY-MM-DD HH:mm
}
export interface putTaskPayload {
  content: string;
  performers: number[];
  teams: number[];
  expiredAt: string; // YYYY-MM-DD HH:mm
  tags: number[];
  theme: number;
}

// =================================================================================================//= [- GET   -]
export async function getTasks({
  date, // YYYY-MM-DD
  projectID,
}: {
  date: string; // YYYY-MM-DD
  projectID: number;
}) {
  try {
    const response = await api.get(`/projects/${projectID}/tasks`, {
      params: {
        date,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}
// =================================================================================================//= [- POST  -]
export async function postTask({
  projectID,
  data,
}: {
  projectID: number;
  data: postTaskPayload;
}) {
  try {
    const response = await api.post(`/projects/${projectID}/tasks`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

// =================================================================================================//= [- DELETE-]
export async function deleteTask({
  projectID,
  taskID,
}: {
  projectID: number;
  taskID: number;
}) {
  try {
    const response = await api.delete(`/projects/${projectID}/tasks/${taskID}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}
// =================================================================================================//= [- PUT   -]
export async function putTask({
  projectID,
  taskID,
  data,
}: {
  projectID: number;
  taskID: number;
  data: putTaskPayload;
}) {
  try {
    const response = await api.put(
      `/projects/${projectID}/tasks/${taskID}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

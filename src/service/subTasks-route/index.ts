import { api } from "@/plugin/axios/axios";

// =================================================================================================//= [- GET   -]
// =================================================================================================//= [- POST  -]
export async function postSubTask({
  projectID,
  taskID,
  data,
}: {
  projectID: number;
  taskID: number;
  data: {
    content: string;
    performers: number[];
    teams: number[];
  };
}) {
  try {
    const response = await api.post(
      `/projects/${projectID}/tasks/${taskID}/subtasks`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating subtask:", error);
  }
}

// =================================================================================================//= [- DELETE-]
export async function deleteSubTask({
  projectID,
  taskID,
  subTaskID,
}: {
  projectID: number;
  taskID: number;
  subTaskID: number;
}) {
  try {
    const response = await api.delete(
      `/projects/${projectID}/tasks/${taskID}/subtasks/${subTaskID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting subtask:", error);
  }
}
// =================================================================================================//= [- PUT   -]
export async function putSubTask({
  projectID,
  taskID,
  subTaskID,
  data,
}: {
  projectID: number;
  taskID: number;
  subTaskID: number;
  data: {
    content: string;
    performers: number[];
    teams: number[];
  };
}) {
  try {
    const response = await api.put(
      `/projects/${projectID}/tasks/${taskID}/subtasks/${subTaskID}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subtask:", error);
  }
}

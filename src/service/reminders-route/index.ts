import { api } from "@/plugin/axios/axios";

// --------------------------------------------------------  INTERFACE  --------------------------------------------------------
export interface postReminderPayload {
  reminders: [
    {
      id: number;
      project: number;
      context: string;
    },
  ];
}

// =================================================================================================//= [- GET   -]
export async function getReminders({
  date, // YYYY-MM-DD
  projectID,
}: {
  date: string; // YYYY-MM-DD
  projectID: number;
}): Promise<postReminderPayload | undefined> {
  try {
    const response = await api.get(`/projects/${projectID}/reminders`, {
      params: {
        date,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reminders:", error);
  }
}

// =================================================================================================//= [- POST  -]
export async function postReminder({
  projectID,
  data,
}: {
  projectID: number;
  data: {
    content: string;
    date: string; // YYYY-MM-DD HH:mm
  };
}) {
  try {
    const response = await api.post(`/projects/${projectID}/reminders`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating reminder:", error);
  }
}

// =================================================================================================//= [- DELETE-]
export async function deleteReminder({
  reminderID,
  projectID,
}: {
  reminderID: number;
  projectID: number;
}) {
  try {
    const response = await api.delete(
      `/projects/${projectID}/reminders/${reminderID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting reminder:", error);
  }
}

// =================================================================================================//= [- PUT   -]
export async function putReminder({
  reminderID,
  projectID,
  data,
}: {
  reminderID: number;
  projectID: number;
  data: {
    context: string;
  };
}) {
  try {
    const response = await api.put(
      `/projects/${projectID}/reminders/${reminderID}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating reminder:", error);
  }
}

import { api } from "@/plugin/axios/axios";
// TYPES
export interface User {
  users: TelegramUserData;
}

// =================================================================================================//= [- GET   -]
export async function getUser({
  id,
  type,
}: {
  id: string;
  type: "id" | "telegram_id";
}) {
  try {
    const response = await api.get<User>("/user", {
      params: {
        id,
        type,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
// =================================================================================================//= [- POST  -]
// =================================================================================================//= [- DELETE-]
// =================================================================================================//= [- PUT   -]
export async function putUser({
  user_id,
  fullname,
  invite_to_family,
  invite_to_organization,
}: {
  user_id: string;
  fullname?: string;
  invite_to_family?: boolean;
  invite_to_organization?: boolean;
}): Promise<User> {
  const response = await api.put("/user", undefined, {
    params: {
      user_id,
      fullname,
      invite_to_family,
      invite_to_organization,
    },
    headers: {
      accept: "application/json",
    },
  });

  return response.data;
}

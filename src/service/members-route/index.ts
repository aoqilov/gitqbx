import { api } from "@/plugin/axios/axios";

// =================================================================================================//= [- GET   -]
// =================================================================================================//= [- POST  -]
// =================================================================================================//= [- DELETE-]
export async function deleteMember({
  workspaceID,
  memberID,
}: {
  workspaceID: string;
  memberID: string;
}) {
  try {
    const response = await api.delete(
      `/workspaces/${workspaceID}/members/${memberID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting members:", error);
    return false;
  }
}

// =================================================================================================//= [- PUT   -]
export async function putMember({
  workspaceID,
  memberID,
  data,
}: {
  workspaceID: string;
  memberID: string;
  data: Partial<Member>;
}) {
  try {
    const response = await api.put(
      `/workspaces/${workspaceID}/members/${memberID}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating members:", error);
    return false;
  }
}

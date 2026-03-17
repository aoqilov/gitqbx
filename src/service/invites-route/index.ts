import { api } from "@/plugin/axios/axios";
// ------------------ interface ------------------

export interface WorkspaceShort {
  id: number;
  name: string;
  members: Member[];
}

export interface Invite {
  id: number;
  workspace: number;
  user: number;
  workspaces: WorkspaceShort;
}

export interface InvitesResponse {
  invites: Invite[];
}

// ================================================================================================-//- [- GET   -]
export async function getInvites(): Promise<InvitesResponse | undefined> {
  try {
    const response = await api.get<InvitesResponse>("/invites");
    return response.data;
  } catch (error) {
    console.error("Error fetching invites:", error);
    return undefined;
  }
}
//
export async function getInviteByIdWorkspaceCalled({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<InvitesResponse | undefined> {
  try {
    const response = await api.get<InvitesResponse>(
      `/workspaces/${workspaceId}/invites`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching invite by workspace ID:", error);
    return undefined;
  }
}
// =================================================================================================//= [- POST  -]
export async function postInvite({
  workspaceId,
  userId,
}: {
  workspaceId: number;
  userId: number;
}): Promise<Invite | undefined> {
  try {
    const response = await api.post<Invite>(
      `/workspaces/${workspaceId}/invites/${userId}`,
      {},
      {
        headers: {
          accept: "application/json",
          id: userId.toString(),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error posting invite:", error);
    return undefined;
  }
}
// =================================================================================================//= [- DELETE-]
// =================================================================================================//= [- PUT   -]
export async function putInvite({
  workspaceId,
  inviteId,
  answer,
}: {
  workspaceId: number;
  inviteId: number;
  answer: boolean;
}): Promise<Invite | undefined> {
  try {
    const response = await api.put<Invite>(
      `/workspaces/${workspaceId}/invites/${inviteId}`,
      { answer },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating invite:", error);
    return undefined;
  }
}

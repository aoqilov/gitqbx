declare interface TeamsState {
  list: Team[];
  loading: boolean;
}

declare interface TeamsResponse {
  teams: Team[];
}

declare interface Team {
  id: number;
  workspace: number;
  name: string;
  members: Member[];
}

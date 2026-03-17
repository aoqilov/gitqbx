declare interface RolesState {
  list: Role[];
  loading: boolean;
  error?: string;
}

declare interface Role {
  id: number;
  workspace: number;
  name: string;
  permissions: number[];
}

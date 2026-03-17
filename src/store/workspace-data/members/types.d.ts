declare interface MembersState {
  list: Member[];
}
declare interface Member {
  id: number;
  user: number;
  workspace: number;
  project: number;
  team: number;
  type: string;
  isOwner: boolean;
  role: number;
  permissions: number[];
  total_tasks_count: number;
  completed_tasks_count: number;
  uncompleted_tasks_count: number;
  userData: {
    id: number;
    fullname: string;
    telegram_avatar: string;
    first_name: string;
    last_name: string;
    index_quality: number;
  };
}

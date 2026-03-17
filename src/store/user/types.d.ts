declare interface UserSlice {
  initData: string;
  user: TelegramUserData;
}

declare interface AccessTasksYears<T> {
  first: T;
  last: T;
}
declare interface TelegramUserData {
  id: string;
  fullname: string;
  index_quality: number;
  invite_to_family: boolean;
  invite_to_organization: boolean;
  telegram_avatar: string;
  telegram_first_name: string;
  telegram_last_name: string;
  telegram_username: string;
  telegram_id: string;
}

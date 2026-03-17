import { createSlice } from "@reduxjs/toolkit";

const initialState: UserSlice = {
  initData: "",
  user: {
    id: "5",
    fullname: "Nick Vazovskiy",
    index_quality: 5,
    invite_to_family: true,
    invite_to_organization: false,
    telegram_avatar: "https://randomuser.me/api/portraits/men/70.jpg",
    telegram_first_name: "Nick",
    telegram_last_name: "Vazovskiy",
    telegram_username: "akiylov",
    telegram_id: "632370273",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInitData: (state, data: reducerBase<string>) => {
      state.initData = data.payload;
    },

    setUser: (state, data: reducerBase<TelegramUserData>) => {
      state.user = data.payload;
    },
  },
});

export const { actions, reducer } = userSlice;

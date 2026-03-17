import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TeamsState = {
  list: [],
  loading: false,
};

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeams(state, action: PayloadAction<Team[]>) {
      state.list = action.payload;
    },
    addTeam(state, action: PayloadAction<Team>) {
      state.list.push(action.payload);
    },
    updateTeam(state, action: PayloadAction<Team>) {
      const index = state.list.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeTeam(state, action: PayloadAction<number>) {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
    setTeamsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearTeams(state) {
      state.list = [];
      state.loading = false;
    },
  },
});

export const { actions, reducer } = teamsSlice;
export const {
  setTeams,
  addTeam,
  updateTeam,
  removeTeam,
  setTeamsLoading,
  clearTeams,
} = teamsSlice.actions;

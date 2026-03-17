import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MembersState = {
  list: [],
};

export const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers(state, action: PayloadAction<Member[]>) {
      state.list = action.payload;
    },
    addMember(state, action: PayloadAction<Member>) {
      state.list.push(action.payload);
    },
    updateMember(state, action: PayloadAction<Member>) {
      const index = state.list.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeMember(state, action: PayloadAction<number>) {
      state.list = state.list.filter((m) => m.id !== action.payload);
    },

    clearMembers(state) {
      state.list = [];
    },
  },
});

export const { actions, reducer } = membersSlice;
export const {
  setMembers,
  addMember,
  updateMember,
  removeMember,
  clearMembers,
} = membersSlice.actions;

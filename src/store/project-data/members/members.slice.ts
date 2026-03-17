import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProjectMembersState = {
  list: [],
};

export const projectMembersSlice = createSlice({
  name: "projectMembers",
  initialState,
  reducers: {
    setProjectMembers(state, action: PayloadAction<ProjectMember[]>) {
      state.list = action.payload;
    },
    addProjectMember(state, action: PayloadAction<ProjectMember>) {
      state.list.push(action.payload);
    },
    updateProjectMember(state, action: PayloadAction<ProjectMember>) {
      const index = state.list.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeProjectMember(state, action: PayloadAction<number>) {
      state.list = state.list.filter((m) => m.id !== action.payload);
    },

    clearProjectMembers(state) {
      state.list = [];
    },
  },
});

export const { actions, reducer } = projectMembersSlice;
export const {
  setProjectMembers,
  addProjectMember,
  updateProjectMember,
  removeProjectMember,
  clearProjectMembers,
} = projectMembersSlice.actions;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProjectsState = {
  list: [],
  loading: false,
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.list = action.payload;
    },
    addProject(state, action: PayloadAction<Project>) {
      state.list.push(action.payload);
    },
    updateProject(state, action: PayloadAction<Project>) {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeProject(state, action: PayloadAction<number>) {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    setProjectsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearProjects(state) {
      state.list = [];
      state.loading = false;
      state.error = undefined;
    },
  },
});

export const { actions, reducer } = projectsSlice;
export const {
  setProjects,
  addProject,
  updateProject,
  removeProject,
  setProjectsLoading,
  clearProjects,
} = projectsSlice.actions;

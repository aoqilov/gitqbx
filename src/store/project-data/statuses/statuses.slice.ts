import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProjectStatusesState = {
  byProjectId: {},
};

export const projectStatusesSlice = createSlice({
  name: "projectStatuses",
  initialState,
  reducers: {
    setProjectStatuses(
      state,
      action: PayloadAction<{ projectId: number; statuses: ProjectStatus[] }>,
    ) {
      const { projectId, statuses } = action.payload;
      if (!state.byProjectId[projectId]) {
        state.byProjectId[projectId] = statuses;
      }
    },

    addProjectStatus(
      state,
      action: PayloadAction<{ projectId: number; status: ProjectStatus }>,
    ) {
      const { projectId, status } = action.payload;
      if (!state.byProjectId[projectId]) {
        state.byProjectId[projectId] = [];
      }
      state.byProjectId[projectId].push(status);
    },

    updateProjectStatus(
      state,
      action: PayloadAction<{ projectId: number; status: ProjectStatus }>,
    ) {
      const { projectId, status } = action.payload;
      const list = state.byProjectId[projectId];
      if (list) {
        const index = list.findIndex((s) => s.id === status.id);
        if (index !== -1) {
          list[index] = status;
        }
      }
    },

    removeProjectStatus(
      state,
      action: PayloadAction<{ projectId: number; statusId: number }>,
    ) {
      const { projectId, statusId } = action.payload;
      if (state.byProjectId[projectId]) {
        state.byProjectId[projectId] = state.byProjectId[projectId].filter(
          (s) => s.id !== statusId,
        );
      }
    },

    clearProjectStatuses(state, action: PayloadAction<number>) {
      delete state.byProjectId[action.payload];
    },
  },
});

export const { actions, reducer } = projectStatusesSlice;
export const {
  setProjectStatuses,
  addProjectStatus,
  updateProjectStatus,
  removeProjectStatus,
  clearProjectStatuses,
} = projectStatusesSlice.actions;

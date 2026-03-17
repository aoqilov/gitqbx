import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceMode } from "./enums";

const initialState: ParamsSlice = {
  serverIP: "https://qubnix.uz",
  language: "ru",
  menuMode: "default",
  workspaceName: "",
  workspaceMode: WorkspaceMode.Device,
  projectNameForHeader: "",
  projectNameForHeader2: "",
  taskProgress: { total: 0, completed: 0 },
  payment: false,
};

export const paramsSlice = createSlice({
  name: "params",
  initialState,
  reducers: {
    setMenuMode: (state, action: PayloadAction<MenuMode>) => {
      state.menuMode = action.payload;
    },
    setWorkspaceMode: (state, action: PayloadAction<WorkspaceMode>) => {
      state.workspaceMode = action.payload;
    },
    setWorkspaceName: (state, action: PayloadAction<string>) => {
      state.workspaceName = action.payload;
    },

    setProjectNameForHeader: (state, action: PayloadAction<string>) => {
      state.projectNameForHeader = action.payload;
    },
    setProjectNameForHeader2: (state, action: PayloadAction<string>) => {
      state.projectNameForHeader2 = action.payload;
    },
    setTaskProgress: (state, action: PayloadAction<TaskProgress>) => {
      state.taskProgress = action.payload;
    },
    setPayment: (state, action: PayloadAction<boolean>) => {
      state.payment = action.payload;
    },
  },
});

export const { actions, reducer } = paramsSlice;
export const {
  setMenuMode,
  setWorkspaceName,
  setWorkspaceMode,
  setProjectNameForHeader,
  setProjectNameForHeader2,
  setTaskProgress,
  setPayment,
} = actions;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProjectThemesState = {
  byProjectId: {},
};

export const projectThemesSlice = createSlice({
  name: "projectThemes",
  initialState,
  reducers: {
    setProjectThemes(
      state,
      action: PayloadAction<{ projectId: number; themes: ProjectTheme[] }>,
    ) {
      const { projectId, themes } = action.payload;
      if (!state.byProjectId[projectId]) {
        state.byProjectId[projectId] = themes;
      }
    },

    addProjectTheme(
      state,
      action: PayloadAction<{ projectId: number; theme: ProjectTheme }>,
    ) {
      const { projectId, theme } = action.payload;
      if (!state.byProjectId[projectId]) {
        state.byProjectId[projectId] = [];
      }
      state.byProjectId[projectId].push(theme);
    },

    updateProjectTheme(
      state,
      action: PayloadAction<{ projectId: number; theme: ProjectTheme }>,
    ) {
      const { projectId, theme } = action.payload;
      const list = state.byProjectId[projectId];
      if (list) {
        const index = list.findIndex((t) => t.id === theme.id);
        if (index !== -1) {
          list[index] = theme;
        }
      }
    },

    removeProjectTheme(
      state,
      action: PayloadAction<{ projectId: number; themeId: number }>,
    ) {
      const { projectId, themeId } = action.payload;
      if (state.byProjectId[projectId]) {
        state.byProjectId[projectId] = state.byProjectId[projectId].filter(
          (t) => t.id !== themeId,
        );
      }
    },

    clearProjectThemes(state, action: PayloadAction<number>) {
      delete state.byProjectId[action.payload];
    },
  },
});

export const { actions, reducer } = projectThemesSlice;
export const {
  setProjectThemes,
  addProjectTheme,
  updateProjectTheme,
  removeProjectTheme,
  clearProjectThemes,
} = projectThemesSlice.actions;

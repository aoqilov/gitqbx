import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from "zod";

const initialState: ProjectTagsState = {
  byProjectTagsGroupId: {},
  byProjectTagId: {},
};

export const projectTagsGroupSlice = createSlice({
  name: "projectTags",
  initialState,
  reducers: {
    // ----------------------------------------------------------------------------Project Tags Group
    setProjectTagsGroup(
      state,
      action: PayloadAction<{
        projectId: number;
        tagsGroup: ProjectTagGroup[];
      }>,
    ) {
      const { projectId, tagsGroup } = action.payload;
      if (!state.byProjectTagsGroupId[projectId]) {
        state.byProjectTagsGroupId[projectId] = tagsGroup;
      }
    },
    addProjectTagsGroup(
      state,
      action: PayloadAction<{ projectId: number; tagsGroup: ProjectTagGroup }>,
    ) {
      const { projectId, tagsGroup } = action.payload;
      if (!state.byProjectTagsGroupId[projectId]) {
        state.byProjectTagsGroupId[projectId] = [];
      }
      state.byProjectTagsGroupId[projectId].push(tagsGroup);
    },
    updateProjectTagsGroup(
      state,
      action: PayloadAction<{ projectId: number; tagsGroup: ProjectTagGroup }>,
    ) {
      const { projectId, tagsGroup } = action.payload;
      const list = state.byProjectTagsGroupId[projectId];
      if (list) {
        const index = list.findIndex((r) => r.id === tagsGroup.id);
        if (index !== -1) {
          list[index] = tagsGroup;
        }
      }
    },
    removeProjectTagsGroup(
      state,
      action: PayloadAction<{ projectId: number; tagsGroupId: number }>,
    ) {
      const { projectId, tagsGroupId } = action.payload;
      if (state.byProjectTagsGroupId[projectId]) {
        state.byProjectTagsGroupId[projectId] = state.byProjectTagsGroupId[
          projectId
        ].filter((r) => r.id !== tagsGroupId);
      }
    },
    clearProjectTagsGroup(state, action: PayloadAction<number>) {
      delete state.byProjectTagsGroupId[action.payload];
    },

    // ----------------------------------------------------------------------------Project Tags one
    setProjectTags(
      state,
      action: PayloadAction<{ projectId: number; tags: ProjectTag[] }>,
    ) {
      const { projectId, tags } = action.payload;
      if (!state.byProjectTagId[projectId]) {
        state.byProjectTagId[projectId] = [];
      }
      state.byProjectTagId[projectId] = tags;
    },
    addProjectTag(
      state,
      action: PayloadAction<{ projectId: number; tag: ProjectTag }>,
    ) {
      const { projectId, tag } = action.payload;
      if (!state.byProjectTagId[projectId]) {
        state.byProjectTagId[projectId] = [];
      }
      state.byProjectTagId[projectId].push(tag);
    },
    updateProjectTag(
      state,
      action: PayloadAction<{ projectId: number; tag: ProjectTag }>,
    ) {
      const { projectId, tag } = action.payload;
      const list = state.byProjectTagId[projectId];
      if (list) {
        const index = list.findIndex((r) => r.id === tag.id);
        if (index !== -1) {
          list[index] = tag;
        }
      }
    },
    removeProjectTag(
      state,
      action: PayloadAction<{ projectId: number; tagId: number }>,
    ) {
      const { projectId, tagId } = action.payload;
      const list = state.byProjectTagId[projectId];
      if (list) {
        state.byProjectTagId[projectId] = list.filter((r) => r.id !== tagId);
      }
    },
    clearProjectTags(state, action: PayloadAction<number>) {
      delete state.byProjectTagId[action.payload];
    },
  },
});

export const { actions, reducer } = projectTagsGroupSlice;
export const {
  // ---------------------------------------------------------------------------Project Tags Group
  setProjectTagsGroup,
  addProjectTagsGroup,
  updateProjectTagsGroup,
  removeProjectTagsGroup,
  clearProjectTagsGroup,
  // ----------------------------------------------------------------------------Project Tags one
  addProjectTag,
  updateProjectTag,
  removeProjectTag,
  clearProjectTags,
} = projectTagsGroupSlice.actions;

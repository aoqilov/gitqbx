// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const initialState: ProjectRolesState = {
//   list: [],
// };

// export const projectRolesSlice = createSlice({
//   name: "projectRoles",
//   initialState,
//   reducers: {
//     setProjectRoles(state, action: PayloadAction<ProjectRole[]>) {
//       state.list = action.payload;
//     },
//     addProjectRole(state, action: PayloadAction<ProjectRole>) {
//       state.list.push(action.payload);
//     },
//     updateProjectRole(state, action: PayloadAction<ProjectRole>) {
//       const index = state.list.findIndex((r) => r.id === action.payload.id);
//       if (index !== -1) {
//         state.list[index] = action.payload;
//       }
//     },
//     removeProjectRole(state, action: PayloadAction<number>) {
//       state.list = state.list.filter((r) => r.id !== action.payload);
//     },

//     clearProjectRoles(state) {
//       state.list = [];
//     },
//   },
// });

// export const { actions, reducer } = projectRolesSlice;
// export const {
//   setProjectRoles,
//   addProjectRole,
//   updateProjectRole,
//   removeProjectRole,
//   clearProjectRoles,
// } = projectRolesSlice.actions;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProjectRolesState = {
  byProjectId: {},
};

export const projectRolesSlice = createSlice({
  name: "projectRoles",
  initialState,
  reducers: {
    // Bitta project uchun rollarni set qilish (qayta yozmasdan)
    setProjectRoles(
      state,
      action: PayloadAction<{ projectId: number; roles: ProjectRole[] }>
    ) {
      const { projectId, roles } = action.payload;
      // Faqat o'sha project uchun set qiladi, boshqalarini tezmaydi
      if (!state.byProjectId[projectId]) {
        state.byProjectId[projectId] = roles;
      }
    },

    addProjectRole(
      state,
      action: PayloadAction<{ projectId: number; role: ProjectRole }>
    ) {
      const { projectId, role } = action.payload;
      if (!state.byProjectId[projectId]) {
        state.byProjectId[projectId] = [];
      }
      state.byProjectId[projectId].push(role);
    },

    updateProjectRole(
      state,
      action: PayloadAction<{ projectId: number; role: ProjectRole }>
    ) {
      const { projectId, role } = action.payload;
      const list = state.byProjectId[projectId];
      if (list) {
        const index = list.findIndex((r) => r.id === role.id);
        if (index !== -1) {
          list[index] = role;
        }
      }
    },

    removeProjectRole(
      state,
      action: PayloadAction<{ projectId: number; roleId: number }>
    ) {
      const { projectId, roleId } = action.payload;
      if (state.byProjectId[projectId]) {
        state.byProjectId[projectId] = state.byProjectId[projectId].filter(
          (r) => r.id !== roleId
        );
      }
    },

    clearProjectRoles(state, action: PayloadAction<number>) {
      delete state.byProjectId[action.payload];
    },
  },
});

export const { actions, reducer } = projectRolesSlice;
export const {
  setProjectRoles,
  addProjectRole,
  updateProjectRole,
  removeProjectRole,
  clearProjectRoles,
} = projectRolesSlice.actions;
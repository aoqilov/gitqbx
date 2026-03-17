import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: RolesState = {
  list: [],
  loading: false,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRoles(state, action: PayloadAction<Role[]>) {
      state.list = action.payload;
    },
    addRole(state, action: PayloadAction<Role>) {
      state.list.push(action.payload);
    },
    updateRole(state, action: PayloadAction<Role>) {
      const index = state.list.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeRole(state, action: PayloadAction<number>) {
      state.list = state.list.filter((r) => r.id !== action.payload);
    },
    setRolesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearRoles(state) {
      state.list = [];
      state.loading = false;
      state.error = undefined;
    },
  },
});

export const { actions, reducer } = rolesSlice;
export const {
  setRoles,
  addRole,
  updateRole,
  removeRole,
  setRolesLoading,
  clearRoles,
} = rolesSlice.actions;

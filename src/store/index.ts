import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { reducer as paramsReducer } from "./params/params.slice";
import { reducer as userReducer } from "./user/user.slice";
import { reducer as projectsReducer } from "./workspace-data/projects/projects.slice";
import { reducer as rolesReducer } from "./workspace-data/roles/roles.slice";
import { reducer as membersReducer } from "./workspace-data/members/members.slice";
import { reducer as teamsReducer } from "./workspace-data/teams/teams.slice";
import { reducer as projectMembersReducer } from "./project-data/members/members.slice";
import { reducer as projectThemesReducer } from "./project-data/themes/themes.slice";
import { reducer as projectTagsReducer } from "./project-data/tags/tagsGroup.slice";
import { reducer as projectStatusesReducer } from "./project-data/statuses/statuses.slice";
import { reducer as projectRolesReducer } from "./project-data/roles/roles.slice";

const reducers = combineReducers({
  params: paramsReducer,
  user: userReducer,
  projects: projectsReducer,
  roles: rolesReducer,
  members: membersReducer,
  teams: teamsReducer,
  //
  projectMembers: projectMembersReducer,
  projectThemes: projectThemesReducer,
  projectTags: projectTagsReducer,
  projectStatuses: projectStatusesReducer,
  projectRoles: projectRolesReducer,
  //
});

export const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

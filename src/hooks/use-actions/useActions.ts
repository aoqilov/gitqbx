import { actions as userActions } from "../../store/user/user.slice";
import { actions as paramsActions } from "../../store/params/params.slice";
import { actions as rolesActions } from "../../store/workspace-data/roles/roles.slice";
import { actions as projectsActions } from "../../store/workspace-data/projects/projects.slice";
import { actions as membersActions } from "../../store/workspace-data/members/members.slice";
import { actions as teamsActions } from "../../store/workspace-data/teams/teams.slice";
//
import { actions as projectMembersActions } from "../../store/project-data/members/members.slice";
import { actions as projectThemesActions } from "../../store/project-data/themes/themes.slice";
import { actions as projectTagsActions } from "../../store/project-data/tags/tagsGroup.slice";
import { actions as projectStatusesActions } from "../../store/project-data/statuses/statuses.slice";
import { actions as projectRolesActions } from "../../store/project-data/roles/roles.slice";

import { bindActionCreators } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useDispatch } from "react-redux";

const rootActions = {
  ...userActions,
  ...paramsActions,
  ...rolesActions,
  ...projectsActions,
  ...membersActions,
  ...teamsActions,
  //
  ...projectMembersActions,
  ...projectThemesActions,
  ...projectTagsActions,
  ...projectStatusesActions,
  ...projectRolesActions,
};

export const useActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => bindActionCreators(rootActions, dispatch), [dispatch]);
};

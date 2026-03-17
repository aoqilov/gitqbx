import { Outlet } from "react-router-dom";

import LoaderView from "@/views/app/loader-view/LoaderView";
import PaymentsView from "@/views/app/payments/payments-view/PaymentsView";
import CardLinkView from "@/views/app/payments/card-link-view/CardLinkView";
import OfferView from "@/views/app/payments/offer-view/OfferView";
import PaymentView from "@/views/app/payments/payment-view/PaymentView";
import PaymentSuccess from "@/views/app/payments/payment-success/PaymentSuccess";
import PaymentLoading from "@/views/app/payments/payment-loading/PaymentLoading";
import PaymentError from "@/views/app/payments/payment-error/PaymentError";

import RoutineView from "@/views/project-pages/routines-view/RoutineView";
import MembersView from "@/views/project-pages/members-view/MembersView";
import RolesView from "@/views/project-pages/roles-view/RolesView";
import PoliciesView from "@/views/project-pages/policies-view/PoliciesView";
import TagsGroupView from "@/views/project-pages/tags-groups-view/TagsGroupView";
import ThemeView from "@/views/project-pages/themes-view/ThemeView";
//
import WorkListView from "@/views/workspace-pages/work-list-view/WorkListView";
import WorkTasksView from "@/views/workspace-pages/work-tasks-view/WorkTasksView";
import WorkTeamsView from "@/views/workspace-pages/work-teams-view/WorkTeamsView";
import WorkMembersView from "@/views/workspace-pages/work-members-view/WorkMembersView";
import WorkRolesView from "@/views/workspace-pages/work-roles-view/WorkRolesView";
import WorkParamsView from "@/views/workspace-pages/work-params-view/WorkParamsView";
import WorkReportsView from "@/views/workspace-pages/work-report-view/WorkReportsView";
import WorkProjectsView from "@/views/workspace-pages/work-projects-view/WorkProjectsView";
import WorkSyncDeviceView from "@/views/workspace-pages/work-sync-device/WorkSyncDeviceView";
import TagsView from "@/views/project-pages/tags-view/TagsView";
import StatusesView from "@/views/project-pages/statuses-view/StatusesView";

export type AppRoute = {
  path: string;
  element?: JSX.Element;
  children?: AppRoute[];
};

export const myRoutes: AppRoute[] = [
  // ROOT
  {
    path: "/",
    element: <LoaderView />,
  },

  // APP / PAYMENTS
  {
    path: "app",
    element: <Outlet />,
    children: [
      {
        path: "payments",
        element: <Outlet />,
        children: [
          { path: "", element: <PaymentsView /> }, // default /app/payments
          { path: "card-link", element: <CardLinkView /> },
          { path: "offer", element: <OfferView /> },
          { path: "payment", element: <PaymentView /> },
          { path: "success", element: <PaymentSuccess /> },
          { path: "loading", element: <PaymentLoading /> },
          { path: "error", element: <PaymentError /> },
        ],
      },
    ],
  },

  // workspace
  {
    path: "workspace",
    element: <Outlet />,
    children: [
      // /workspace
      { path: "", element: <WorkListView /> },

      // /workspace/:workspaceID/...
      {
        path: ":workspaceID",
        element: <Outlet />,
        children: [
          { path: "tasks", element: <WorkTasksView /> },
          { path: "teams", element: <WorkTeamsView /> },
          { path: "members", element: <WorkMembersView /> },
          { path: "roles", element: <WorkRolesView /> },
          { path: "params", element: <WorkParamsView /> },
          { path: "reports", element: <WorkReportsView /> },
          { path: "sync", element: <WorkSyncDeviceView /> },

          {
            path: "projects",
            element: <Outlet />,
            children: [
              // projects
              { path: "", element: <WorkProjectsView /> },
              // /workspace/:workSpaceID/projects/:porjectID/children
              {
                path: ":projectID",
                element: <Outlet />,
                children: [
                  { path: "routine-tasks", element: <RoutineView /> },
                  { path: "members", element: <MembersView /> },
                  { path: "roles", element: <RolesView /> },
                  { path: "policies", element: <PoliciesView /> },
                  { path: "statuses", element: <StatusesView /> },
                  {
                    path: "tags-group",
                    element: <Outlet />,
                    children: [
                      { path: "", element: <TagsGroupView /> },
                      { path: ":tagGroupID", element: <TagsView /> },
                    ],
                  },
                  { path: "themes", element: <ThemeView /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

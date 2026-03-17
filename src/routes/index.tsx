// import { Route, Routes } from "react-router-dom";

// import LoaderView from "@/views/app/loader-view/LoaderView";
// import PaymentsView from "@/views/app/payments/payments-view/PaymentsView";
// import CardLinkView from "@/views/app/payments/card-link-view/CardLinkView";
// import OfferView from "@/views/app/payments/offer-view/OfferView";
// import PaymentView from "@/views/app/payments/payment-view/PaymentView";

// import TasksView from "@/views/personal/tasks-view/TasksView";
// import StatisticsView from "@/views/personal/statistics-view/StatisticsView";
// import DevicesView from "@/views/personal/sync/devices-view/DevicesView";

// import OrganizationsView from "@/views/organizations/organizations-view/OrganizationsView";
// import ProjectsView from "@/views/organizations/projects-view/ProjectsView";
// import * as OrganizationsTasks from "@/views/organizations/tasks-view/TasksView";
// import * as OrganizationsMembers from "@/views/organizations/members-view/MembersView";
// import * as OrganizationsRoles from "@/views/organizations/roles-view/RolesView";
// import * as OrganizationsParams from "@/views/organizations/params-view/ParamsView";
// import TeamsView from "@/views/organizations/teams-view/TeamsView";
// import ReportsView from "@/views/organizations/reports-view/ReportsView";

// import FamiliesView from "@/views/families/families-view/FamiliesView";
// import * as FamiliesTasks from "@/views/families/tasks-view/TasksView";
// import * as FamiliesMembers from "@/views/families/members-view/MembersView";
// import * as FamiliesRoles from "@/views/families/roles-view/RolesView";
// import * as FamiliesParams from "@/views/families/params-view/ParamsView";
// import PaymentSuccess from "@/views/app/payments/payment-success/PaymentSuccess";
// import PaymentLoading from "@/views/app/payments/payment-loading/PaymentLoading";
// import PaymentError from "@/views/app/payments/payment-error/PaymentError";

// // TODO:
// //  HAMA TIRE SLASHGA OZGARSIN

// const AppRoutes = () => (
//   <Routes>
//     <Route path="/" element={<LoaderView />} />
//     <Route path="/app-payments" element={<PaymentsView />} />
//     <Route path="/app-payments-card-link" element={<CardLinkView />} />
//     <Route path="/app-payments-offer" element={<OfferView />} />
//     <Route path="/app-payments-payment" element={<PaymentView />} />
//     <Route path="/app-payments-success" element={<PaymentSuccess />} />
//     <Route path="/app-payments-loading" element={<PaymentLoading />} />
//     <Route path="/app-payments-error" element={<PaymentError />} />
//     <Route path="/personal-tasks" element={<TasksView />} />
//     <Route path="/personal-statistics" element={<StatisticsView />} />
//     <Route path="/personal-sync-devices" element={<DevicesView />} />
//     <Route path="/organizations" element={<OrganizationsView />} />
//     <Route
//       path="/organizations-tasks"
//       element={<OrganizationsTasks.default />}
//     />
//     <Route path="/organizations-teams" element={<TeamsView />} />
//     <Route
//       path="/organizations-members"
//       element={<OrganizationsMembers.default />}
//     />
//     <Route
//       path="/organizations-roles"
//       element={<OrganizationsRoles.default />}
//     />
//     <Route
//       path="/organizations-params"
//       element={<OrganizationsParams.default />}
//     />
//     <Route path="/organizations-reports" element={<ReportsView />} />
//     <Route path="/organizations-projects/" element={<ProjectsView />} />
//     /organizations/projects/roles
//     <Route path="/families" element={<FamiliesView />} />
//     <Route path="/families-tasks" element={<FamiliesTasks.default />} />
//     <Route path="/families-members" element={<FamiliesMembers.default />} />
//     <Route path="/families-roles" element={<FamiliesRoles.default />} />
//     <Route path="/families-params" element={<FamiliesParams.default />} />
//   </Routes>
// );

// export default AppRoutes;
import NotFoundView from "@/views/not-found/NotFoundView";
import { Route, Routes } from "react-router-dom";
import { AppRoute, myRoutes } from "./myRoutes";

// ... boshqa importlar
// Recursive route render function
const renderRoute = (route: AppRoute): JSX.Element => {
  if (route.children && route.children.length > 0) {
    return (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children.map((child) => renderRoute(child))}
      </Route>
    );
  }
  return <Route key={route.path} path={route.path} element={route.element} />;
};
const AppRoutes = () => {
  return (
    <Routes>
      {myRoutes.map((route) => renderRoute(route))}
      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};
export default AppRoutes;

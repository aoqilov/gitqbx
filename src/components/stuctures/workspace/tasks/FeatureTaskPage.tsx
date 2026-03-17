import PageLayout from "@/components/layouts/page-layout/PageLayout";
import React from "react";
import MyTaskView from "./inner-pages/my-task-view/MyTaskView";
import WorkspaceBaseView from "./inner-pages/workspace-base-view/WorkspaceBaseView";
import { useWorkspaceDynamicNames } from "@/hooks/use-workspace-menu/useWorkspaceDynamicNames";

const FeatureTaskPage = () => {
  // -------------------------------------- HOOKS
  const { mode } = useWorkspaceDynamicNames();
  // -------------------------------------- STATES
  // -------------------------------------- QUERIES
  // -------------------------------------- RENDER
  return (
    <PageLayout>
      {mode === "device" ? <MyTaskView /> : <WorkspaceBaseView />}
    </PageLayout>
  );
};

export default FeatureTaskPage;

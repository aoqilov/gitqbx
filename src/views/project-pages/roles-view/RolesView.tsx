import PageLayout from "@/components/layouts/page-layout/PageLayout";
import FeatureProjectRoles from "@/components/stuctures/projects/roles/FeatureProjectRoles";
import FeatureProjectPage from "@/components/stuctures/workspace/projects/FeatureProjectPage";
import FeatureRolePage from "@/components/stuctures/workspace/roles/FeatureRolePage";
import { Feature } from "framer-motion";
import React from "react";

const RolesView = () => {
  return (
    <PageLayout>
      <FeatureProjectRoles />
    </PageLayout>
  );
};

export default RolesView;

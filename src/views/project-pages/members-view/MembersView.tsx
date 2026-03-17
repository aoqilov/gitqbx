import PageLayout from "@/components/layouts/page-layout/PageLayout";
import FeatureProjectMembersPage from "@/components/stuctures/projects/members/FeatureProjectMembersPage";
import FeatureMembersPage from "@/components/stuctures/workspace/members/FeatureMembersPage";
import React from "react";

const MembersView = () => {
  return (
    <PageLayout>
      <FeatureProjectMembersPage />
    </PageLayout>
  );
};

export default MembersView;

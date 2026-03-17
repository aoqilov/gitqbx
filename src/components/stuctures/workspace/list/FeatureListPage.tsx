import PageLayout from "@/components/layouts/page-layout/PageLayout";

import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import SegmentComponent from "@/components/ui/segment/SegmentComponent";

import { FC, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setWorkspaceMode } from "@/store/params/params.slice";
import { WorkspaceMode } from "@/store/params/enums";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import { useWorkspaceDynamicNames } from "@/hooks/use-workspace-menu/useWorkspaceDynamicNames";
import WorkspaceListOrganizationFamily from "./worspaces-list/WorkspaceListOrganizationFamily";
import WorkspaceListInvites from "./invites-list/WorkspaceListInvites";
import { useTranslation } from "@/i18n/languageConfig";

const FeatureListPage: FC = () => {
  // --------------------------------------   HOOKS
  const { t } = useTranslation("workspace.pages.");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { title } = useWorkspaceDynamicNames();
  // --------------------------------------   QUERYS

  // --------------------------------------   STATE

  const [tab, setTab] = useState<"list" | "invite">("list");

  // --------------------------------------   FUNCTIONS
  const optionsTitle = [
    {
      label: `${t("listworkspace.list")} ${title}`,
      value: "list",
    },
    { label: `${t("listworkspace.invitations")}`, value: "invite" },
  ];

  return (
    <div>
      <PageLayout>
        <div className="w-full min-h-[calc(100vh-80px)]!  relative">
          <div className="mt-4!">
            <TemplateHeader
              title={title}
              showBack={true}
              onBackClick={() => {
                navigate("/workspace/def/tasks");
                setTimeout(() => {
                  dispatch(setWorkspaceMode(WorkspaceMode.Device));

                  return clearInterval(0);
                }, 300);
              }}
            />
          </div>
          <div className="mt-4!">
            <SegmentComponent
              options={optionsTitle}
              onChange={(value) => setTab(value as "list" | "invite")}
              value={tab}
              animation={false}
            />
          </div>

          <ScrollArea
            size={"xs"}
            orientation="vertical"
            className="max-h-[70vh]! w-full mt-5!  "
            isShow={false}
          >
            {tab === "list" ? (
              <WorkspaceListOrganizationFamily />
            ) : tab === "invite" ? (
              <WorkspaceListInvites />
            ) : null}
          </ScrollArea>
        </div>
      </PageLayout>
    </div>
  );
};

export default FeatureListPage;

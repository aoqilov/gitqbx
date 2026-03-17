import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import Text from "@/components/ui/typography/Text";
import { useActions } from "@/hooks/use-actions/useActions";
import { useWorkspaceDynamicNames } from "@/hooks/use-workspace-menu/useWorkspaceDynamicNames";
import { useTranslation } from "@/i18n/languageConfig";
import { getWorkspaces, Workspace } from "@/service/workspace-route";

import { WorkspaceMode } from "@/store/params/enums";
import {
  setMenuMode,
  setWorkspaceMode,
  setWorkspaceName,
} from "@/store/params/params.slice";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GoOrganization } from "react-icons/go";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const WorkspaceListOrganizationFamily = () => {
  // --------------------------------------   HOOKS
  const { t } = useTranslation("workspace.pages.listworkspace");
  const { setRoles, setMembers, setProjects } = useActions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useWorkspaceDynamicNames();

  // --------------------------------------   STATE
  const [selectItem, setSelectItem] = useState<Workspace | null>(null);

  // --------------------------------------   QUERYS
  const resWorkspaces = useQuery({
    queryKey: ["workspaces"],
    queryFn: () =>
      getWorkspaces({
        type: mode as "family" | "organization" | "device",
      }),
  });

  const workspacesData = resWorkspaces?.data?.workspaces || [];

  console.log("Workspaces data:", selectItem);

  useEffect(() => {
    if (selectItem) {
      setRoles(selectItem.roles);
      setMembers(selectItem.members);
      setProjects(selectItem.projects);
    }
  }, [selectItem, dispatch]); // --------------------------------------   FUNCTIONS

  return (
    <div className="flex flex-col gap-2 py-2!">
      {resWorkspaces.isLoading ? (
        <ListSkeleton count={5} />
      ) : workspacesData.length === 0 ? (
        <div className="flex flex-col items-center gap-2 mt-10">
          <NoData />
        </div>
      ) : null}
      {workspacesData?.map((item: any) => {
        console.log(item);
        return (
          <TemplateList
            key={item.id}
            item={item}
            index={item.id}
            showIcon
            icon={mode === "family" ? MdOutlineFamilyRestroom : GoOrganization}
            primaryText={item.name}
            onClick={(item) => {
              setSelectItem(item);
              navigate(`/workspace/${item.id}/tasks`);
              dispatch(setWorkspaceName(item.name));
              dispatch(setMenuMode(item.type));
              dispatch(setWorkspaceMode(item.type as WorkspaceMode));
              // Set workspace mode based on current mode when selecting item
            }}
            activeItem={selectItem}
            renderRight={(item) => {
              const isActive = selectItem?.id === item.id;
              return (
                <>
                  <Text
                    fontSize="0.85em"
                    whiteSpace="nowrap"
                    color={isActive ? "#fff" : "var(--text-lgray-dgreydark)"}
                  >
                    {t("workspace.participantsCount")}
                    {/* {item.members.length} участников */}
                  </Text>
                </>
              );
            }}
          />
        );
      })}
    </div>
  );
};

export default WorkspaceListOrganizationFamily;

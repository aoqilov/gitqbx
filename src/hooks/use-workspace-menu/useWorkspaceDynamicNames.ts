import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { WorkspaceMode } from "@/store/params/enums";
import { useTranslation } from "@/i18n/languageConfig";

export const useWorkspaceDynamicNames = () => {
  const { workspaceMode } = useSelector((state: RootState) => state.params);
  const { t } = useTranslation();

  const workspaceConfig: Partial<
    Record<
      WorkspaceMode,
      { title: string; mode: string; taskPageTitle: string }
    >
  > = {
    [WorkspaceMode.Family]: {
      mode: "family",
      //
      // worklistview
      title: t("workspace.family"),
      taskPageTitle: t("workspace.familyTask"),

      //
      //
    },
    [WorkspaceMode.Organization]: {
      mode: "organization",
      //
      // worklistview
      title: t("workspace.organization"),
      taskPageTitle: t("workspace.organizationTask"),
    },
  };

  return (
    workspaceConfig[workspaceMode] || {
      mode: "device",

      title: "",
      taskPageTitle: t("workspace.myTask"),
    }
  );
};

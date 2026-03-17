import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import InputForm from "@/components/ui/input/InputForm";
import { useDebouncer } from "@/hooks/debouncer/useDebouncer";
import { useActions } from "@/hooks/use-actions/useActions";
import { useTranslation } from "@/i18n/languageConfig";
import { putWorkspace } from "@/service/workspace-route";
import { RootState } from "@/store";
import { globalParams } from "@/utils/globalParams";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { TbCopy } from "react-icons/tb";
import { useSelector } from "react-redux";

const FeatureSettingsWorkspacePage = () => {
  const { t } = useTranslation("workspace.pages.paramsws.");
  const { workspaceID } = globalParams();
  const { workspaceName } = useSelector((state: RootState) => state.params);
  const { setWorkspaceName } = useActions();
  const [organizationName, setOrganizationName] =
    React.useState<string>(workspaceName);
  const debouncedName = useDebouncer<string>({
    value: organizationName,
    time: 500,
  });

  const putMutation = useMutation({
    mutationFn: () =>
      putWorkspace({
        name: debouncedName,
        workspaceID: workspaceID!,
      }),
  });

  React.useEffect(() => {
    setWorkspaceName(debouncedName as string);
    putMutation.mutateAsync();
  }, [debouncedName, setWorkspaceName]);

  const [telegramChat, setTelegramChat] = React.useState<string>("");
  return (
    <div className="flex flex-col ">
      <div className="mt-5!">
        <TemplateHeader title={t("title")} showBack={true} toBackTask={true} />
        <div className="mt-8! flex flex-col gap-4 max-w-2xl">
          <InputForm
            label={t("label.nameorg")}
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder={t("placeholder.nameorg")}
          />
          <InputForm
            label={t("label.chattg")}
            value={telegramChat}
            onChange={(e) => setTelegramChat(e.target.value)}
            placeholder={t("placeholder.chattg")}
            extraIcon={TbCopy}
            disabled
            onExtraIconClick={() => {
              navigator.clipboard.writeText(telegramChat);
              console.log("Скопировано в буфер обмена:", telegramChat);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureSettingsWorkspacePage;

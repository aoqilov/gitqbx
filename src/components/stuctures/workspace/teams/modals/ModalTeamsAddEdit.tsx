import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import { postTeam, putTeam } from "@/service/teams-route";
import { useActions } from "@/hooks/use-actions/useActions";
import { globalParams } from "@/utils/globalParams";
import { refetchForInvalidate } from "@/utils/refetchForInvalidateQuery";
import { showToast } from "@/utils/showToaster";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { MdOutlineOutlinedFlag } from "react-icons/md";
import { VscEdit } from "react-icons/vsc";
import { useGetStoreDataByWorkspaceId } from "@/hooks/use-store-data";
import { SelectCompoent } from "@/components/ui/select/SelectCompoent";
import { useTranslation } from "@/i18n/languageConfig";

type UserForm = {
  teamName: string;
  teamMember: number[];
};

interface TeamProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: Team | null;
}

export const ModalTeamsAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: TeamProps) => {
  // -------------------------------   HOOKS
  const { t } = useTranslation("workspace.pages.teamsws.");
  const { workspaceID } = globalParams();
  const { members } = useGetStoreDataByWorkspaceId(+workspaceID!);
  const { addTeam, updateTeam } = useActions();

  const isEdit = mode === "edit";

  // Stable memoized items — prevents SelectCompoent from rebuilding its
  // collection on every render (aria-hidden / re-mount fix).
  const memberItems = useMemo(
    () =>
      members.map((member) => ({
        label: member.userData.fullname
          ? member.userData.fullname
          : member.userData.first_name + " " + member.userData.last_name,
        value: member.id,
        avatar: member.userData.telegram_avatar,
      })),
    [members],
  );

  // Stable default values — computed once per open/mode/initialData change,
  // not recreated as an inline object literal inside JSX.
  const defaultValues = useMemo<UserForm>(
    () => ({
      teamName: isEdit ? (initialData?.name ?? "") : "",
      teamMember: isEdit ? (initialData?.members?.map((m) => m.id) ?? []) : [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEdit, initialData?.id],
  );
  const postMutation = useMutation({
    mutationFn: async (data: UserForm) =>
      postTeam({
        workspaceID: workspaceID!,
        data: {
          name: data.teamName,
          users: data.teamMember,
        },
      }),
    onSuccess: (result) => {
      if (result) {
        addTeam(result as Team);
      }
      refetchForInvalidate(["list-teams"]);
      showToast({ type: "success" });
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });
  const putMutation = useMutation({
    mutationFn: async ({
      data,
      teamID,
    }: {
      data: UserForm;
      teamID: number;
    }) => {
      return putTeam({
        workspaceID: workspaceID!,
        teamID,
        data: {
          name: data.teamName,
          users: data.teamMember,
        },
      });
    },
    onSuccess: (result) => {
      if (result) {
        updateTeam(result as Team);
      }
      refetchForInvalidate(["list-teams"]);
      showToast({ type: "success" });
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });

  const handleSubmitUser = async (data: UserForm) => {
    if (isEdit) {
      await putMutation.mutateAsync({
        data,
        teamID: initialData!.id,
      });
      cancelSelection();
    } else {
      postMutation.mutateAsync(data);
    }

    close();
  };

  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      title={isEdit ? t("titleEdit") : t("titleAdd")}
      titleIcon={isEdit ? VscEdit : MdOutlineOutlinedFlag}
      buttonLabel={isEdit ? t("buttonLabelEdit") : t("buttonLabelAdd")}
      onSubmit={handleSubmitUser}
      defaultValues={defaultValues}
    >
      {({ setValue, control }) => (
        <div className="flex flex-col gap-5! pb-20!">
          <Controller
            name="teamName"
            control={control}
            rules={{ required: t("error.required") }}
            render={({ field, fieldState }) => (
              <InputForm
                maxLength={100}
                label={t("label.teamName")}
                placeholder={t("placeholder.teamName")}
                {...field}
                isRequired
                error={fieldState.error?.message}
                clearMethod={() => setValue("teamName", "")}
              />
            )}
          />

          <Controller
            name="teamMember"
            control={control}
            render={({ field }) => (
              <SelectCompoent
                isSearchable
                label={t("label.teamMember")}
                placeholder={t("placeholder.teamMember")}
                items={memberItems}
                value={field.value}
                onValueChange={field.onChange}
                isMulti
              />
            )}
          />
        </div>
      )}
    </DrawerComponentBasic>
  );
};

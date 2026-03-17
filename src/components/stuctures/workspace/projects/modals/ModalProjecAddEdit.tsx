import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import {
  postProject,
  PostProjectPayload,
  putProject,
} from "@/service/projects-route";
import { showToast } from "@/utils/showToaster";
import { useMutation } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { LuFolderPlus } from "react-icons/lu";
import { VscEdit } from "react-icons/vsc";
import { globalParams } from "@/utils/globalParams";
import { refetchForInvalidate } from "@/utils/refetchForInvalidateQuery";
import { useGetStoreDataByWorkspaceId } from "@/hooks/use-store-data";
import { SelectCompoent } from "@/components/ui/select/SelectCompoent";
import { useMemo } from "react";
import { useTranslation } from "@/i18n/languageConfig";

type UserForm = {
  nameProject: string;
  membersId: string[];
  teamsId: string[];
};

interface OrganizationProjectProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    id?: string | number;
    key?: string;
    name: string;
    members?: ProjectMember[];
  } | null;
}

export const ModalProjecAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: OrganizationProjectProps) => {
  const isEdit = mode === "edit";
  // =============================  HOOKS
  const { t } = useTranslation("workspace.pages.projectsws.");
  const { workspaceID } = globalParams();
  const { members } = useGetStoreDataByWorkspaceId(+workspaceID!);

  // =============================  MEMOS
  const memberItems = useMemo(
    () =>
      members.map((member) => ({
        label: member.userData.fullname
          ? member.userData.fullname
          : member.userData.first_name + " " + member.userData.last_name,
        value: String(member.userData.id),
        avatar: member.userData.telegram_avatar,
      })),
    [members],
  );

  // edit modeda project.members ichidagi user IDlarini string[] ga aylantiramiz
  const defaultMembersId = useMemo(
    () =>
      isEdit && initialData?.members
        ? initialData.members.map((m) => String(m.user))
        : [],
    [isEdit, initialData?.id],
  );

  // =============================  STATE
  // =============================  QUERIES

  const mutationProjectPost = useMutation({
    mutationFn: (payload: PostProjectPayload) =>
      postProject(workspaceID!, payload),
    onSuccess: () => {
      showToast({ type: "success" });
      refetchForInvalidate(["projects", workspaceID]);
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });
  const mutationProjectPut = useMutation({
    mutationFn: (payload: PostProjectPayload) =>
      putProject(workspaceID!, (initialData?.id ?? initialData?.id)!, payload),
    onSuccess: () => {
      showToast({ type: "success" });
      refetchForInvalidate(["projects", workspaceID]);
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });
  // =============================  FUNCTIONS

  const handleSubmitUser = async (data: UserForm) => {
    const payload: PostProjectPayload = {
      name: data.nameProject,
      users: data.membersId.map(Number),
      teams: data.teamsId.map(Number),
    };

    if (isEdit) {
      await mutationProjectPut.mutateAsync(payload);
      cancelSelection();
    } else {
      await mutationProjectPost.mutateAsync(payload);
    }
    close();
  };

  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      // Mode-ga qarab dinamik sarlavha va icon
      title={isEdit ? t("titleEdit") : t("titleAdd")}
      titleIcon={isEdit ? VscEdit : LuFolderPlus}
      buttonLabel={isEdit ? t("btnEdit") : t("btnSave")}
      onSubmit={handleSubmitUser}
      // Mode-ga qarab default qiymatlar
      defaultValues={{
        nameProject: isEdit ? initialData?.name || "" : "",
        membersId: defaultMembersId,
        teamsId: [],
      }}
    >
      {(form) => {
        const { setValue, control } = form;

        return (
          <div className="flex flex-col gap-5! pb-20! ">
            <Controller
              name="nameProject"
              control={control}
              rules={{ required: t("errorInput.required") }}
              render={({ field, fieldState }) => (
                <InputForm
                  maxLength={150}
                  label={t("label.projectName")}
                  placeholder={t("placeholder.projectName")}
                  {...field}
                  isRequired
                  error={fieldState.error?.message}
                  clearMethod={() => setValue("nameProject", "")}
                />
              )}
            />
            <Controller
              name="membersId"
              control={control}
              render={({ field }) => {
                return (
                  <SelectCompoent
                    isSearchable
                    isMulti
                    label={t("label.projectParticipants")}
                    placeholder={t("placeholder.projectParticipants")}
                    value={field.value}
                    onValueChange={field.onChange}
                    items={memberItems}
                  />
                );
              }}
            />
            {/* APII  workspace uchun team qoshilishini kutlvotdi */}
            {/* <Controller
              name="teamsId"
              control={control}
              render={({ field }) => {
                const teamsOptions = listTeamsStoreWorkspace.map((team) => ({
                  value: String(team.id),
                  label: team.name,
                }));
                return (
                  <SelectAvatarCheck
                    label={t("label.projectTeams")}
                    placeholder={t("placeholder.projectTeams")}
                    {...field}
                    mode="team"
                    options={teamsOptions}
                    value={teamsOptions.filter((opt) =>
                      field.value?.includes(opt.value),
                    )}
                    onChange={(selected) =>
                      field.onChange(
                        selected ? selected.map((item) => item.value) : [],
                      )
                    }
                  />
                );
              }}
            /> */}
          </div>
        );
      }}
    </DrawerComponentBasic>
  );
};

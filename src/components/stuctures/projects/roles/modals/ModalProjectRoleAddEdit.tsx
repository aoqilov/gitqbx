import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import SelectAvatarCheck from "@/components/ui/select/SelectAvatarCheck";
import { permissionList } from "@/constants/permisionsList";
import { postRoleProject, putRoleWorkspace } from "@/service/roles-route";
import { useActions } from "@/hooks/use-actions/useActions";
import { globalParams } from "@/utils/globalParams";
import { showToast } from "@/utils/showToaster";
import { useMutation } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { FaMask } from "react-icons/fa";
import { VscEdit } from "react-icons/vsc";
import { useTranslation } from "@/i18n/languageConfig";

type UserForm = {
  roleName: string;
  rolePermission: number[];
};

interface RoleProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    id: number;
    name: string;
    permissions: number[];
  } | null;
}

export const ModalProjectRoleAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: RoleProps) => {
  const isEdit = mode === "edit";

  // --------------------------------------  HOOKS
  const { t } = useTranslation("workspace.pages.projectRole.");
  const { projectID } = globalParams();

  const { addProjectRole, updateProjectRole } = useActions();

  // -------------------------------------- QUERYS
  const postMutation = useMutation({
    mutationFn: async (data: UserForm) =>
      postRoleProject({
        projectID: projectID!,
        data: {
          name: data.roleName,
          permissions: data.rolePermission,
        },
      }),
    onSuccess: (newRole) => {
      if (newRole) {
        addProjectRole({
          projectId: +projectID!,
          role: newRole,
        });
      }
      showToast({ type: "success" });
      close();
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });

  const putMutation = useMutation({
    mutationFn: async (data: UserForm) =>
      putRoleWorkspace({
        roleID: initialData!.id,
        data: {
          name: data.roleName,
          permissions: data.rolePermission,
        },
      }),
    onSuccess: (updatedRole) => {
      if (updatedRole) {
        updateProjectRole({
          projectId: +projectID!,
          role: updatedRole,
        });
      }
      showToast({ type: "success" });
      cancelSelection();
      close();
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });

  // --------------------------------------  FUNCTIONS
  const handleSubmitUser = async (data: UserForm) => {
    if (isEdit) {
      await putMutation.mutateAsync(data);
    } else {
      await postMutation.mutateAsync(data);
    }
  };

  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      title={isEdit ? t("titleEdit") : t("titleAdd")}
      titleIcon={isEdit ? VscEdit : FaMask}
      buttonLabel={isEdit ? t("btnEdit") : t("btnAdd")}
      onSubmit={handleSubmitUser}
      defaultValues={{
        roleName: initialData?.name || "",
        rolePermission: initialData?.permissions || [],
      }}
    >
      {(form) => {
        const { setValue, control } = form;

        return (
          <div className="flex flex-col gap-5! pb-20!">
            <Controller
              name="roleName"
              control={control}
              rules={{ required: t("errors.required") }}
              render={({ field, fieldState }) => (
                <InputForm
                  maxLength={50}
                  label={t("labels.roleName")}
                  placeholder={t("placeholders.enterRoleName")}
                  {...field}
                  isRequired
                  error={fieldState.error?.message}
                  clearMethod={() => setValue("roleName", "")}
                />
              )}
            />

            <Controller
              name="rolePermission"
              control={control}
              rules={{ required: t("errors.required") }}
              render={({ field }) => {
                const options = permissionList.map((item) => ({
                  label: item.description,
                  value: item.id,
                }));

                const selectedOptions = options.filter((option) =>
                  field.value?.includes(option.value),
                );

                return (
                  <SelectAvatarCheck
                    label={t("labels.permissions")}
                    placeholder={t("placeholders.selectPermissions")}
                    {...field}
                    mode="team"
                    options={options}
                    value={selectedOptions}
                    onChange={(selected) =>
                      field.onChange(
                        selected ? selected.map((item) => item.value) : [],
                      )
                    }
                  />
                );
              }}
            />
          </div>
        );
      }}
    </DrawerComponentBasic>
  );
};

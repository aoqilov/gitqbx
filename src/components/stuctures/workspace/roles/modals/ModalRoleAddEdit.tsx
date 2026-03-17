import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";

import { permissionList } from "@/constants/permisionsList";
import { postRoleWorkspace, putRoleWorkspace } from "@/service/roles-route";
import { RootState } from "@/store";
import { useActions } from "@/hooks/use-actions/useActions";
import { globalParams } from "@/utils/globalParams";
import { showToast } from "@/utils/showToaster";
import { useMutation } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { FaMask } from "react-icons/fa";
import { VscEdit } from "react-icons/vsc";
import { SelectCompoent } from "@/components/ui/select/SelectCompoent";
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

export const ModalRoleAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: RoleProps) => {
  const isEdit = mode === "edit";

  // --------------------------------------  HOOKS
  const { t } = useTranslation("workspace.pages.rolews.");
  const { setRoles, updateRole } = useActions();
  const roles = useSelector((state: RootState) => state.roles.list);
  const { workspaceID } = globalParams();

  // -------------------------------------- QUERYS
  const postMutation = useMutation({
    mutationFn: async (data: UserForm) =>
      postRoleWorkspace({
        workspaceID: workspaceID!,
        data: {
          name: data.roleName,
          permissions: data.rolePermission,
        },
      }),
    onSuccess: (newRole) => {
      if (newRole) {
        setRoles([...roles, newRole]);
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
        updateRole(updatedRole);
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
      buttonLabel={isEdit ? t("buttonLabelEdit") : t("buttonLabelAdd")}
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
              rules={{ required: t("errorInput.required") }}
              render={({ field, fieldState }) => (
                <InputForm
                  maxLength={50}
                  label={t("label.createRole")}
                  placeholder={t("placeholder.createRole")}
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
              rules={{ required: "Выберите права для роли" }}
              render={({ field }) => {
                return (
                  <SelectCompoent
                    label={t("label.permissions")}
                    placeholder={t("placeholder.permissions")}
                    isMulti
                    isRequired
                    items={permissionList.map((permission) => ({
                      label: permission.description,
                      value: String(permission.id),
                    }))}
                    value={field.value}
                    onValueChange={field.onChange}
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

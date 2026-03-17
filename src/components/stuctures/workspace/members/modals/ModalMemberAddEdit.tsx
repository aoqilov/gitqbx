import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import { SelectCompoent } from "@/components/ui/select/SelectCompoent";
import { SelectCompoentCreate } from "@/components/ui/select/SelectCompoentCreate";
import { permissionList } from "@/constants/permisionsList";
import { useGetStoreDataByWorkspaceId } from "@/hooks/use-store-data";
import { useTranslation } from "@/i18n/languageConfig";
import { globalParams } from "@/utils/globalParams";

import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { FaUsers } from "react-icons/fa";
import { VscEdit } from "react-icons/vsc";

// roleMember — single value (number), stored in array for SelectCompoent compatibility
type UserForm = {
  usernameMember: number[]; // add modeda: tanlangan memberlar id-lari
  roleMember: number[]; // bitta rol (single select, lekin array wrappeda)
  teamMember: number[]; // permissions id-lari (multi)
};

interface MemberProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: Member | null; // to'g'ridan-to'g'ri Member type
}

export const ModalMemberAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: MemberProps) => {
  // ---------------------------------------------------  HOOKS
  const { t } = useTranslation("workspace.pages.membersws.");
  const { workspaceID } = globalParams();
  const { members, roles } = useGetStoreDataByWorkspaceId(+workspaceID!);

  const isEdit = mode === "edit";

  // Memoized stable arrays — reference stays the same unless source data changes.
  // Prevents SelectCompoent from rebuilding its collection and re-mounting the
  // Chakra UI portal/positioner (aria-hidden warning fix).
  const roleItems = useMemo(
    () => roles.map((role) => ({ value: role.id, label: role.name })),
    [roles],
  );

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

  const permissionItems = useMemo(
    () => permissionList.map((p) => ({ value: p.id, label: p.description })),
    [],
  );

  // ---------------------------------------------------  DEFAULTS
  // Edit modeda initialData (Member) dan to'g'ri qiymatlar olinadi
  const defaultValues: UserForm = {
    usernameMember: isEdit && initialData ? [initialData.user] : [],
    roleMember: isEdit && initialData ? [initialData.role] : [],
    teamMember: isEdit && initialData ? initialData.permissions : [],
  };

  // ---------------------------------------------------  SUBMIT
  const handleSubmitUser = async (data: UserForm) => {
    if (isEdit && initialData) {
      // Mavjud memberni yangilash: rol va permissions ni o'zgartirish
      const updated = {
        role: data.roleMember[0] ?? initialData.role,
        permissions: data.teamMember,
      };
      console.log("updated member", updated);
      cancelSelection();
    } else {
      // Yangi memberlar qo'shish: har bir tanlangan user uchun
      data.usernameMember.forEach((userId) => {
        const sourceMember = members.find((m) => m.id === userId);
        if (!sourceMember) return;
        const newMember = {
          role: data.roleMember[0] ?? 0,
          permissions: data.teamMember,
        };
        console.log("new member", newMember);
      });
    }

    close();
  };

  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      title={isEdit ? t("titleEdit") : t("titleAdd")}
      titleIcon={isEdit ? VscEdit : FaUsers}
      buttonLabel={isEdit ? t("btnEdit") : t("btnSave")}
      onSubmit={handleSubmitUser}
      defaultValues={defaultValues}
    >
      {({ control }) => (
        <div className="flex flex-col gap-5! pb-20!">
          {/* Faqat add modeda ko'rinadi — edit paytida user o'zgarmaydi */}
          {!isEdit && (
            <Controller
              name="usernameMember"
              control={control}
              rules={{ required: t("errorInput.required") }}
              render={({ field }) => (
                <SelectCompoentCreate
                  label={t("label.createMember")}
                  placeholder={t("placeholder.createMember")}
                  isMulti
                  isSearchable
                  items={memberItems}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
          )}

          <Controller
            name="roleMember"
            control={control}
            render={({ field }) => (
              <SelectCompoent
                isClearable={false}
                label={t("label.role")}
                placeholder={t("placeholder.role")}
                items={roleItems}
                value={
                  Array.isArray(field.value) ? field.value[0] : field.value
                }
                onValueChange={(val) =>
                  // ensure form keeps the array shape: single selected value wrapped in an array, or empty array when cleared
                  field.onChange(val != null ? [val as number] : [])
                }
              />
            )}
          />

          <Controller
            name="teamMember"
            control={control}
            render={({ field }) => (
              <SelectCompoent
                label={t("label.permissions")}
                placeholder={t("placeholder.permissions")}
                isMulti
                items={permissionItems}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </div>
      )}
    </DrawerComponentBasic>
  );
};

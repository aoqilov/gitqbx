import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import SelectAvatarCheck from "@/components/ui/select/SelectAvatarCheck";
import SwitchComponent from "@/components/ui/switch/SwitchComponent";
import { useGetStoreAllWorkspace } from "@/hooks/use-store-data";
import { useTranslation } from "@/i18n/languageConfig";
import { Controller } from "react-hook-form";
import { LuFolderPlus } from "react-icons/lu";
import { VscEdit } from "react-icons/vsc";

type UserForm = {
  isActive: boolean; // ⬅ qo‘shildi
  usersMember: string[];
  roleMember: string[];
  teamMember: string[];
};

interface MemberProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    id: number;
    usersMember: string[];
    membersId?: string[];
    teamsId?: string[];
  } | null;
}

export const membersList = [
  {
    value: "1",
    label: "mem 1",
    image: "/assets/images/avatardev.png",
  },
  {
    value: "2",
    label: "mem 2",
    image: "/assets/images/avatardev.png",
  },
  {
    value: "3",
    label: "mem 3",
    image: "/assets/images/avatardev.png",
  },
  {
    value: "4",
    label: "mem 4",
    image: "/assets/images/avatardev.png",
  },
  {
    value: "5",
    label: "mem 5",
    image: "/assets/images/avatardev.png",
  },
];
const teams = [
  {
    value: "1",
    label: "team 1",
    icons: "FaUsersBetweenLines",
  },
  {
    value: "2",
    label: "team 2",
    icons: "FaUsersBetweenLines",
  },
  {
    value: "3",
    label: "team 3",
    icons: "FaUsersBetweenLines",
  },
  {
    value: "4",
    label: "team 4",
    icons: "FaUsersBetweenLines",
  },
  {
    value: "5",
    label: "team 5",
    icons: "FaUsersBetweenLines",
  },
];

export const ModalProjectMemberAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: MemberProps) => {
  const isEdit = mode === "edit";
  // -------------------------------   HOOKS
  const { t } = useTranslation("workspace.pages.projectMembers.");

  const { members } = useGetStoreAllWorkspace();
  console.log(members);

  const handleSubmitUser = async (data: UserForm) => {
    console.log(data);

    if (isEdit) {
      console.log("UPDATE:", initialData?.id, data);
      cancelSelection();
    } else {
      console.log("CREATE:", data);
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
        isActive: false,
        usersMember: isEdit ? initialData?.usersMember || [] : [],
        roleMember: isEdit ? initialData?.membersId || [] : [],
        teamMember: isEdit ? initialData?.teamsId || [] : [],
      }}
    >
      {(form) => {
        const { setValue, control } = form;

        return (
          <div className="flex flex-col gap-5! pb-20! ">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <SwitchComponent field={field} label={t("chooseTeam")} />
              )}
            />
            <Controller
              name="usersMember"
              control={control}
              render={({ field }) => (
                <SelectAvatarCheck
                  label={t("label.member")}
                  placeholder={t("placeholder.member")}
                  {...field}
                  mode="team"
                  options={membersList}
                  value={membersList.filter((opt) =>
                    field.value?.includes(opt.value),
                  )}
                  onChange={(selected) =>
                    field.onChange(
                      selected ? selected.map((item) => item.value) : [],
                    )
                  }
                />
              )}
            />

            <Controller
              name="roleMember"
              control={control}
              render={({ field }) => (
                <SelectAvatarCheck
                  label={t("label.role")}
                  placeholder={t("placeholder.role")}
                  {...field}
                  mode="single"
                  options={membersList}
                  value={membersList.filter((opt) =>
                    field.value?.includes(opt.value),
                  )}
                  onChange={(selected) =>
                    field.onChange(
                      selected ? selected.map((item) => item.value) : [],
                    )
                  }
                />
              )}
            />

            <Controller
              name="teamMember"
              control={control}
              render={({ field }) => (
                <SelectAvatarCheck
                  label={t("label.permission")}
                  placeholder={t("placeholder.permission")}
                  {...field}
                  mode="team"
                  options={teams}
                  value={teams.filter((opt) =>
                    field.value?.includes(opt.value),
                  )}
                  onChange={(selected) =>
                    field.onChange(
                      selected ? selected.map((item) => item.value) : [],
                    )
                  }
                />
              )}
            />
          </div>
        );
      }}
    </DrawerComponentBasic>
  );
};

import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";

import { showToast } from "@/utils/showToaster";
import { Controller } from "react-hook-form";
import { TbRefreshAlert } from "react-icons/tb";
import { VscEdit } from "react-icons/vsc";

import SelectAvatarCheck from "@/components/ui/select/SelectAvatarCheck";
import TextareaForm from "@/components/ui/input/TextareaForm";

import { membersList } from "@/components/stuctures/projects/members/modals/ModalProjectMemberAddEdit";
import { FaFolderTree } from "react-icons/fa6";

type UserForm = {
  members: string;
  titleSubTask: string;
};

interface RoleProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    key: string;
    name: string;
  } | null;
}

export const ModalWsBaseSubTaskAdd = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: RoleProps) => {
  const isEdit = mode === "edit";

  const handleSubmitUser = async (data: UserForm) => {
    console.log(data);

    if (isEdit) {
      console.log("UPDATE:", initialData?.key, data);
      showToast({ type: "success" });
      cancelSelection();
    } else {
      console.log("CREATE:", data);
      showToast({ type: "success" });
      cancelSelection();
    }
  };

  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      // Mode-ga qarab dinamik sarlavha va icon
      title={isEdit ? "Редактировать подзадачи" : "Добавить  подзадачи"}
      titleIcon={isEdit ? VscEdit : FaFolderTree}
      buttonLabel={isEdit ? "Сохранить изменения" : "Создать подзадачи"}
      onSubmit={handleSubmitUser}
      // Mode-ga qarab default qiymatlar
      defaultValues={{
        members: "",
        titleSubTask: "",
      }}
    >
      {(form) => {
        const { setValue, control, watch } = form;

        return (
          <>
            <div className="flex flex-col gap-5 pb-50!">
              <Controller
                name="titleSubTask"
                control={control}
                rules={{ required: "Напишите название подзадачи" }}
                render={({ field, fieldState }) => {
                  return (
                    <TextareaForm
                      label="Контекст подзадачи"
                      placeholder="Укажите контекст подзадачи"
                      isRequired
                      {...field}
                      error={fieldState.error?.message}
                    />
                  );
                }}
              />
              {/* Участники */}
              <Controller
                name="members"
                control={control}
                rules={{ required: "Напишите контекст подзадачи" }}
                render={({ field }) => {
                  const selectedOption = membersList?.find(
                    (opt) => opt.value === field.value,
                  );
                  const selectValue = selectedOption
                    ? [selectedOption]
                    : undefined;

                  return (
                    <SelectAvatarCheck
                      options={membersList}
                      label="Контекст подзадачи"
                      placeholder="Укажите контекст подзадачи"
                      isRequired
                      mode="single"
                      value={selectValue}
                      onChange={(value) => {
                        if (value && value.length > 0) {
                          field.onChange(value[0].value);
                        } else {
                          field.onChange("");
                        }
                      }}
                    />
                  );
                }}
              />
            </div>
          </>
        );
      }}
    </DrawerComponentBasic>
  );
};

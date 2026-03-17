import ColorPickerComponent from "@/components/ui/color-picker/ColorPickerComponent";
import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import { useActions } from "@/hooks/use-actions/useActions";
import {
  createProjectStatus,
  updateProjectStatus,
} from "@/service/status-route";
import { globalParams } from "@/utils/globalParams";
import { showToast } from "@/utils/showToaster";
import { useMutation } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { TbClipboardCheck } from "react-icons/tb";
import { VscEdit } from "react-icons/vsc";

type UserForm = {
  name: string;
  color: string;
};

interface RoleProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    id: number;
    name: string;
    color: string;
    priority: number;
  } | null;
}

export const ModalProjectStatusAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: RoleProps) => {
  const isEdit = mode === "edit";

  // -------------------------------------- HOOKS
  const { addProjectStatus, updateProjectStatus: updateStatusInStore } =
    useActions();
  const { projectID } = globalParams();

  // -------------------------------------- MUTATIONS
  const postMutation = useMutation({
    mutationFn: (data: UserForm) =>
      createProjectStatus({
        projectID: projectID!,
        data: { name: data.name, color: data.color },
      }),
    onSuccess: (newStatus) => {
      if (newStatus) {
        addProjectStatus({
          projectId: +projectID!,
          status: newStatus,
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
    mutationFn: (data: UserForm) =>
      updateProjectStatus({
        projectID: projectID!,
        statusID: String(initialData!.id),
        data: {
          name: data.name,
          color: data.color,
          priority: initialData!.priority,
        },
      }),
    onSuccess: (updatedStatus) => {
      if (updatedStatus) {
        updateStatusInStore({
          projectId: +projectID!,
          status: updatedStatus,
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
      // Mode-ga qarab dinamik sarlavha va icon
      title={isEdit ? "Редактировать статуса" : "Добавить статуса"}
      titleIcon={isEdit ? VscEdit : TbClipboardCheck}
      buttonLabel={isEdit ? "Сохранить изменения" : "Создать статуса"}
      onSubmit={handleSubmitUser}
      // Mode-ga qarab default qiymatlar
      defaultValues={{
        name: isEdit ? initialData?.name || "" : "",
        color: isEdit ? initialData?.color || "#999" : "#999",
      }}
    >
      {(form) => {
        const { setValue, control } = form;

        return (
          <div className="flex flex-col gap-5! pb-20! ">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Напишите название  статуса" }}
              render={({ field, fieldState }) => (
                <InputForm
                  maxLength={100}
                  label="Название статуса"
                  placeholder="Введите название статуса"
                  {...field}
                  isRequired
                  error={fieldState.error?.message}
                  clearMethod={() => setValue("name", "")}
                />
              )}
            />
            <Controller
              name="color"
              control={control}
              rules={{ required: "Выберите цвет" }}
              render={({ field, fieldState }) => (
                <ColorPickerComponent
                  label="Цвет статуса"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        );
      }}
    </DrawerComponentBasic>
  );
};

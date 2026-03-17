import ColorPickerComponent from "@/components/ui/color-picker/ColorPickerComponent";
import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { showToast } from "@/utils/showToaster";
import { Controller } from "react-hook-form";
import { TbClipboardCheck } from "react-icons/tb";
import { VscEdit } from "react-icons/vsc";
import { StatusForIndexedDB } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  createProjectStatus,
  updateProjectStatus,
} from "@/service/status-route";

export type { StatusForIndexedDB };

type UserForm = {
  name: string;
  color: string;
};

interface StatusAddEditDBProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  projectId: number;
  initialData?: StatusForIndexedDB | ProjectStatus | null;
  onSuccess?: () => void;
}

export const ModalProjectStatusAddEditDB = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
  projectId,
  onSuccess,
}: StatusAddEditDBProps) => {
  const isEdit = mode === "edit";
  const { payment } = useSelector((state: RootState) => state.params);

  // -------------------------------------- HOOKS
  const { isReady, add, edit } = useIndexedDB<StatusForIndexedDB>({
    dbName: "deviceDB",
    storeName: "statuses",
  });

  // -------------------------------------- API HANDLERS
  const handleAddAPI = async (data: UserForm) => {
    await createProjectStatus({
      projectID: String(projectId),
      data: { name: data.name, color: data.color },
    });
  };

  const handleEditAPI = async (data: UserForm) => {
    if (!initialData?.id) {
      console.warn("No initialData id for API edit");
      return;
    }
    await updateProjectStatus({
      projectID: String(projectId),
      statusID: String(initialData.id),
      data: {
        name: data.name,
        color: data.color,
        priority: initialData.priority,
      },
    });
    cancelSelection();
  };

  // -------------------------------------- IDB HANDLERS
  const handleAddIDB = async (data: UserForm) => {
    if (!isReady) return;
    const newStatus: StatusForIndexedDB = {
      local_id: Number(`102${Date.now() % 10000}`),
      id: null,
      project: projectId,
      name: data.name,
      color: data.color,
      priority: Date.now() % 200,
    };
    await add(newStatus);
  };

  const handleEditIDB = async (data: UserForm) => {
    if (!isReady) return;
    if (!initialData || !("local_id" in initialData) || !initialData.local_id) {
      console.warn("No initialData local_id for IDB edit");
      return;
    }
    const updated: StatusForIndexedDB = {
      local_id: initialData.local_id,
      id: initialData.id ?? null,
      project: projectId,
      name: data.name,
      color: data.color,
      priority: initialData.priority,
    };
    await edit(updated);
    cancelSelection();
  };

  // -------------------------------------- MAIN SUBMIT
  const handleSubmitUser = async (data: UserForm) => {
    try {
      if (payment) {
        isEdit ? await handleEditAPI(data) : await handleAddAPI(data);
      } else {
        isEdit ? await handleEditIDB(data) : await handleAddIDB(data);
      }
      showToast({ type: "success" });
      onSuccess?.();
      close();
    } catch (error) {
      console.error(error);
      showToast({ type: "error" });
    }
  };

  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      title={isEdit ? "Редактировать статус" : "Добавить статус"}
      titleIcon={isEdit ? VscEdit : TbClipboardCheck}
      buttonLabel={isEdit ? "Сохранить изменения" : "Создать статус"}
      onSubmit={handleSubmitUser}
      defaultValues={{
        name: isEdit ? initialData?.name || "" : "",
        color: isEdit ? initialData?.color || "#999" : "#999",
      }}
    >
      {(form) => {
        const { setValue, control } = form;

        return (
          <div className="flex flex-col gap-5! pb-20!">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Напишите название статуса" }}
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

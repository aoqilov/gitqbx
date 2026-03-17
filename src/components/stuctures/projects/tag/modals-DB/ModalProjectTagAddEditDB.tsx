import ColorPickerComponent from "@/components/ui/color-picker/ColorPickerComponent";
import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { showToast } from "@/utils/showToaster";
import { Controller } from "react-hook-form";
import { HiHashtag } from "react-icons/hi";
import { VscEdit } from "react-icons/vsc";
import { TagForIndexedDB } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { postTag, putTag } from "@/service/tag-route";
import { globalParams } from "@/utils/globalParams";

type UserForm = {
  name: string;
  color: string;
};

interface TagAddEditDBProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  projectId: number;
  tagGroupId: number;
  initialData?: TagForIndexedDB | ProjectTag | null;
  /** Joriy projectdagi taglar soni — IDB priority hisoblash uchun */
  currentCount?: number;
  onSuccess?: () => void;
}

export const ModalProjectTagAddEditDB = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
  projectId,
  tagGroupId,
  currentCount = 0,
  onSuccess,
}: TagAddEditDBProps) => {
  const isEdit = mode === "edit";
  const { payment } = useSelector((state: RootState) => state.params);

  // -------------------------------------- HOOKS
  const { isReady, add, edit } = useIndexedDB<TagForIndexedDB>({
    dbName: "deviceDB",
    storeName: "tags",
  });
  const { projectID, tagGroupID } = globalParams();

  // -------------------------------------- API HANDLERS
  const handleAddAPI = async (data: UserForm) => {
    console.log("Adding tag via API with data:", data);
  };

  const handleEditAPI = async (data: UserForm) => {
    if (!initialData?.id) {
      console.warn("No initialData id for API edit");
      return;
    }
    console.log(
      "Editing tag via API with data:",
      data,
      "and initialData:",
      initialData,
    );
    cancelSelection();
  };

  // -------------------------------------- IDB HANDLERS
  const handleAddIDB = async (data: UserForm) => {
    if (!isReady) return;
    const newTag: TagForIndexedDB = {
      local_id: Number(`104${Date.now() % 10000}`),
      id: null,
      project: +projectID!,
      tag_group: +tagGroupID!,
      name: data.name,
      color: data.color,
      priority: currentCount + 1,
    };
    await add(newTag);
  };

  const handleEditIDB = async (data: UserForm) => {
    if (!isReady) return;
    if (!initialData || !("local_id" in initialData) || !initialData.local_id) {
      console.warn("No initialData local_id for IDB edit");
      return;
    }
    const updated: TagForIndexedDB = {
      local_id: initialData.local_id,
      id: initialData.id ?? null,
      project: +projectID!,
      tag_group: +tagGroupID!,
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
      title={isEdit ? "Редактировать тег" : "Добавить тег"}
      titleIcon={isEdit ? VscEdit : HiHashtag}
      buttonLabel={isEdit ? "Сохранить изменения" : "Создать тег"}
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
              rules={{ required: "Напишите название тега" }}
              render={({ field, fieldState }) => (
                <InputForm
                  maxLength={100}
                  label="Название тега"
                  placeholder="Введите название тега"
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
                  label="Цвет тега"
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

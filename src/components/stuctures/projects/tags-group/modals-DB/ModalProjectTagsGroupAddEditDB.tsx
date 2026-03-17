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
import { TagGroupForIndexedDB } from "../types";
import { globalParams } from "@/utils/globalParams";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { postTagsGroup, putTagsGroup } from "@/service/tags-group-route";

type UserForm = {
  name: string;
};

interface TagGroupAddEditDBProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  projectId: number;
  initialData?: TagGroupForIndexedDB | ProjectTagGroup | null;
  onSuccess?: () => void;
}

export const ModalProjectTagsGroupAddEditDB = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
  projectId,
  onSuccess,
}: TagGroupAddEditDBProps) => {
  const isEdit = mode === "edit";
  const { payment } = useSelector((state: RootState) => state.params);

  // -------------------------------------- HOOKS
  const { isReady, add, edit, get } = useIndexedDB<TagGroupForIndexedDB>({
    dbName: "deviceDB",
    storeName: "tagGroup",
  });
  const { projectID } = globalParams();

  // -------------------------------------- API HANDLERS
  const handleAddAPI = async (data: UserForm) => {
    console.log("Adding tag group via API with data:", data);
  };

  const handleEditAPI = async (data: UserForm) => {
    if (!initialData?.id) {
      console.warn("No initialData id for API edit");
      return;
    }
    console.log(
      "Editing tag group via API with data:",
      data,
      "and initialData:",
      initialData,
    );
    cancelSelection();
  };

  // -------------------------------------- IDB HANDLERS
  const handleAddIDB = async (data: UserForm) => {
    if (!isReady) return;
    const newTagGroup: TagGroupForIndexedDB = {
      local_id: Number(`103${Date.now() % 10000}`),
      id: null,
      project: +projectID!,
      name: data.name,
    };
    await add(newTagGroup);
  };

  const handleEditIDB = async (data: UserForm) => {
    if (!isReady) return;
    if (!initialData || !("local_id" in initialData) || !initialData.local_id) {
      console.warn("No initialData local_id for IDB edit");
      return;
    }
    const existing = await get(initialData.local_id);
    const updated: TagGroupForIndexedDB = {
      local_id: initialData.local_id,
      id: existing?.id ?? null,
      project: +projectID!,
      name: data.name,
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
      title={isEdit ? "Редактировать группу тегов" : "Добавить группу тегов"}
      titleIcon={isEdit ? VscEdit : HiHashtag}
      buttonLabel={isEdit ? "Сохранить изменения" : "Создать группу тегов"}
      onSubmit={handleSubmitUser}
      defaultValues={{
        name: isEdit ? initialData?.name || "" : "",
      }}
    >
      {(form) => {
        const { setValue, control } = form;

        return (
          <div className="flex flex-col gap-5! pb-20!">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Напишите название группы тегов" }}
              render={({ field, fieldState }) => (
                <InputForm
                  maxLength={100}
                  label="Название группы"
                  placeholder="Введите название группы тегов"
                  {...field}
                  isRequired
                  error={fieldState.error?.message}
                  clearMethod={() => setValue("name", "")}
                />
              )}
            />
          </div>
        );
      }}
    </DrawerComponentBasic>
  );
};

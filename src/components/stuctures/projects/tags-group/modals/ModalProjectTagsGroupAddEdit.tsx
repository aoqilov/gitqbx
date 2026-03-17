import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import { useActions } from "@/hooks/use-actions/useActions";
import { postTagsGroup, putTagsGroup } from "@/service/tags-group-route";
import { globalParams } from "@/utils/globalParams";
import { refetchForInvalidate } from "@/utils/refetchForInvalidateQuery";
import { showToast } from "@/utils/showToaster";
import { useMutation } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { HiHashtag } from "react-icons/hi";
import { VscEdit } from "react-icons/vsc";

type UserForm = {
  name: string;
};

interface RoleProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    id: number;
    name: string;
  } | null;
}

export const ModalProjectTagsGroupAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: RoleProps) => {
  // ----------------------------------------  HOOKS
  const { addProjectTagsGroup, updateProjectTagsGroup } = useActions();
  const isEdit = mode === "edit";
  const { projectID } = globalParams();

  // ----------------------------------------  MUTATIONS
  const mutationCreate = useMutation({
    mutationFn: (data: UserForm) =>
      postTagsGroup({ projectID: projectID!, data }),
    onSuccess: async (newdata) => {
      if (newdata) {
        addProjectTagsGroup({
          projectId: +projectID!,
          tagsGroup: newdata,
        });
      }
      showToast({ type: "success" });
      close();
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });

  const mutationEdit = useMutation({
    mutationFn: (data: UserForm) =>
      putTagsGroup({
        tagGroupID: initialData!.id,
        projectID: projectID!,
        data,
      }),
    onSuccess: async (editData) => {
      if (editData) {
        updateProjectTagsGroup({
          projectId: +projectID!,
          tagsGroup: editData,
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
      await mutationEdit.mutateAsync(data);
    } else {
      await mutationCreate.mutateAsync(data);
    }
  };

  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      // Mode-ga qarab dinamik sarlavha va icon
      title={isEdit ? "Редактировать  группы тегов" : "Добавить  группы тегов"}
      titleIcon={isEdit ? VscEdit : HiHashtag}
      buttonLabel={isEdit ? "Сохранить изменения" : "Создать  группы тегов"}
      onSubmit={handleSubmitUser}
      // Mode-ga qarab default qiymatlar
      defaultValues={{
        name: isEdit ? initialData?.name || "" : "",
      }}
    >
      {(form) => {
        const { setValue, control } = form;

        return (
          <div className="flex flex-col gap-5! pb-20! ">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Напишите название  группы тегов" }}
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

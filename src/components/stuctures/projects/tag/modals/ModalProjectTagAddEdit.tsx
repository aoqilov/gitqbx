import ColorPickerComponent from "@/components/ui/color-picker/ColorPickerComponent";
import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import { useActions } from "@/hooks/use-actions/useActions";
import { postTag, putTag } from "@/service/tag-route";
import { globalParams } from "@/utils/globalParams";
import { showToast } from "@/utils/showToaster";
import { useMutation } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { HiHashtag } from "react-icons/hi";
import { VscEdit } from "react-icons/vsc";
import { useParams } from "react-router-dom";

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
  } | null;
}

export const ModalProjectTagAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: RoleProps) => {
  const isEdit = mode === "edit";

  // -------------------------------------- HOOKS
  const { addProjectTag, updateProjectTag } = useActions();
  const { projectID,tagGroupID } = globalParams();


  // -------------------------------------- MUTATIONS
  const postMutation = useMutation({
    mutationFn: (data: UserForm) =>
      postTag({
        tagGroupID: Number(tagGroupID),
        projectID: projectID!,
        data: { name: data.name, color: data.color },
      }),
    onSuccess: (newTag) => {
      if (newTag) {
        addProjectTag({ projectId: Number(tagGroupID), tag: newTag });
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
      putTag({
        tagID: initialData!.id,
        tagGroupID: Number(tagGroupID),
        projectID: projectID!,
        data: { name: data.name, color: data.color },
      }),
    onSuccess: (updatedTag) => {
      if (updatedTag) {
        updateProjectTag({ projectId: Number(tagGroupID), tag: updatedTag });
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
      title={isEdit ? "Редактировать тега" : "Добавить тега"}
      titleIcon={isEdit ? VscEdit : HiHashtag}
      buttonLabel={isEdit ? "Сохранить изменения" : "Создать тега"}
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
            <Controller
              name="color"
              control={control}
              rules={{ required: "Выберите цвет" }}
              render={({ field, fieldState }) => (
                <ColorPickerComponent
                  label="Цвет группы"
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

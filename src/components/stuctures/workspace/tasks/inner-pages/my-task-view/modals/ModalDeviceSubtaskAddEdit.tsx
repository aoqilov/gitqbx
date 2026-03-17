import { useEffect } from "react";
import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import TextareaForm from "@/components/ui/input/TextareaForm";
import { showToast } from "@/utils/showToaster";
import { Controller } from "react-hook-form";
import { VscEdit } from "react-icons/vsc";
import { IoMdCheckboxOutline } from "react-icons/io";

import Button from "@/components/ui/buttons/Button";

import ScrollArea from "@/components/ui/scroll-area/SrcollArea";

import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { TaskModelI } from "./ModalDeviceAddEdit";
import { Task } from "../my-task-list/MyTaskList";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface SubTaskModelI {
  local_id: number;
  id: null;
  content: string;
  author: number;
  project: number;
  subtaskdone: boolean;
  created_at: Date;
  parent: number;
}

interface RoleProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  parentTask?: Task | null;
  selectedProjectID: number | null;
  onSaved?: () => void;
}

export const ModalDeviceSubtaskAddEdit = ({
  open,
  close,
  mode,
  parentTask,
  cancelSelection,
  selectedProjectID,
  onSaved,
}: RoleProps) => {
  const isEdit = mode === "edit";
  //   const expired_at =
  //   day && time ? new Date(`${day}T${time}:00`).toISOString() : null;

  //   ----------------------------------------------------- HOOKS
  const { user } = useSelector((state: RootState) => state.user);

  const {
    isReady: isTasksReady,
    add: addSubTask,
    edit: editSubTask,
  } = useIndexedDB<SubTaskModelI>({
    dbName: "deviceDB",
    storeName: "subtasks",
  });

  //   ----------------------------------------------------- STATES

  //   ----------------------------------------------------- FUNCTIONS

  const handleSubmitUser = async (data: SubTaskModelI) => {
    try {
      if (!isTasksReady) {
        throw new Error("DB hali tayyor emas");
      }

      const payload: SubTaskModelI = {
        ...data,
      };

      if (isEdit && parentTask) {
        await editSubTask({
          ...parentTask,
          ...payload,
        });
      } else {
        await addSubTask(payload);
      }

      showToast({ type: "success" });

      onSaved?.();

      if (isEdit) cancelSelection();
      close();
    } catch {
      showToast({ type: "error" });
    }
  };

  return (
    <DrawerComponentBasic<SubTaskModelI>
      open={open}
      onOpenChange={close}
      title={isEdit ? "Редактирование подзадачи" : "Создание подзадачи"}
      titleIcon={isEdit ? VscEdit : IoMdCheckboxOutline}
      onSubmit={handleSubmitUser}
      buttonHide
      defaultValues={{
        local_id: Number(`201${Date.now() % 10000}`),
        id: null,
        project: selectedProjectID!,
        author: +user?.id,
        content: "",
        created_at: new Date(),
        parent: parentTask?.local_id ?? 0,
        subtaskdone: false,
      }}
    >
      {(form) => {
        const { control, handleSubmit, setValue } = form;

        useEffect(() => {
          if (!isEdit || !parentTask) return;
          setValue("content", parentTask.content ?? "");
        }, [isEdit, parentTask, setValue]);

        return (
          <div className="flex flex-col gap-5 justify-between">
            <ScrollArea
              isShow={false}
              orientation="vertical"
              className="max-h-125"
            >
              <div className="pb-30! flex flex-col gap-4">
                {/* TASK TEXT */}
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Напишите название задачи" }}
                  render={({ field, fieldState }) => (
                    <TextareaForm
                      maxLength={1024}
                      label="Контекст задачи"
                      placeholder="Выполнить какую-нибудь задачу"
                      isRequired
                      {...field}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </ScrollArea>

            {/* SUBMIT BUTTON */}
            <Button
              onClick={handleSubmit(handleSubmitUser)}
              bg="brand.500"
              type="submit"
              width="full"
              mb={"15px"}
            >
              {isEdit ? "Сохранить изменения" : "Создать задачу"}
            </Button>
          </div>
        );
      }}
    </DrawerComponentBasic>
  );
};

export default ModalDeviceSubtaskAddEdit;

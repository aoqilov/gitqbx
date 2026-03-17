import React, { useEffect } from "react";
import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import TextareaForm from "@/components/ui/input/TextareaForm";
import { showToast } from "@/utils/showToaster";
import { Controller } from "react-hook-form";
import { VscEdit } from "react-icons/vsc";
import { IoMdCheckboxOutline } from "react-icons/io";

import CalendarByInput from "@/components/ui/calendar/CalendarByInput";
import TimePickerCustom from "@/components/ui/time-picker/TimePickerCustom";

import Button from "@/components/ui/buttons/Button";

import ScrollArea from "@/components/ui/scroll-area/SrcollArea";

import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { SelectCompoent } from "@/components/ui/select/SelectCompoent";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Task } from "../my-task-list/MyTaskList";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface TaskModelI {
  local_id: number;
  id: null;
  content: string;
  status: number | null;
  author: number;
  project: number;
  expired_at: string | null;
  tags: [] | null;
  theme: number | null;
  created_at?: Date;
  selectedDay?: string | Date;
  selectedTime?: string;
  taskdone: boolean;
}

interface RoleProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  selectedTask: Task | null;
  selectedProjectID: number | null;
  onSaved?: () => void;
}

export const ModalDeviceAddEdit = ({
  open,
  close,
  mode,
  selectedTask,
  cancelSelection,
  selectedProjectID,
  onSaved,
}: RoleProps) => {
  const isEdit = mode === "edit";
  //   const expired_at =
  //   day && time ? new Date(`${day}T${time}:00`).toISOString() : null;

  //   ----------------------------------------------------- HOOKS
  const { user } = useSelector((state: RootState) => state.user);

  const { isReady: isStatusesReady, getAll: getAllStatuses } = useIndexedDB({
    dbName: "deviceDB",
    storeName: "statuses",
  });
  const { isReady, getAll } = useIndexedDB({
    dbName: "deviceDB",
    storeName: "theme",
  });
  const {
    isReady: isTasksReady,
    add: addTask,
    edit: editTask,
  } = useIndexedDB<TaskModelI>({
    dbName: "deviceDB",
    storeName: "tasks",
  });
  const { isReady: isTagsReady, getAll: getAllTags } = useIndexedDB({
    dbName: "deviceDB",
    storeName: "tags",
  });

  useEffect(() => {
    if (!isTagsReady) return;
    getAllTags().then((data) => {
      const filtered = data.filter(
        (item) => item.project === selectedProjectID,
      );
      return setTags(filtered as []);
    });
  }, [isTagsReady, getAllTags, selectedProjectID]);

  useEffect(() => {
    if (!isStatusesReady) return;
    getAllStatuses().then((data) => {
      const filtered = data.filter(
        (item) => item.project === selectedProjectID,
      );
      return setStatuses(filtered as []);
    });
  }, [isStatusesReady, getAllStatuses, selectedProjectID]);

  useEffect(() => {
    if (!isReady) return;
    getAll().then((data) => {
      const filtered = data.filter(
        (item) => item.project === selectedProjectID,
      );
      setThemes(filtered as []);
      return setThemes(filtered as []);
    });
  }, [isReady, getAll, selectedProjectID]);

  //   ----------------------------------------------------- STATES
  const [themes, setThemes] = React.useState([]);
  const [statuses, setStatuses] = React.useState([]);
  const [tags, setTags] = React.useState([]);

  //   ----------------------------------------------------- FUNCTIONS

  const handleSubmitUser = async (data: TaskModelI) => {
    try {
      if (!isTasksReady) {
        throw new Error("DB hali tayyor emas");
      }
      // tanlangan kun va vaqtni normalize qilish funksiyalari
      const normalizeDay = (value?: string | Date) => {
        if (!value) return null;
        if (value instanceof Date) return value;
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      };

      const normalizeTime = (value?: string) => {
        if (!value) return null;
        const [hours, minutes] = value.split(":");
        if (hours === undefined || minutes === undefined) return null;
        return {
          hours: Number(hours),
          minutes: Number(minutes),
        };
      };

      const dayValue = normalizeDay(data.selectedDay);
      const timeValue = normalizeTime(data.selectedTime);

      let expiredAt: string | null = null;
      if (dayValue) {
        const date = new Date(dayValue);
        if (timeValue) {
          date.setHours(timeValue.hours, timeValue.minutes, 0, 0);
        }
        expiredAt = date.toISOString();
      }

      const payload: TaskModelI = {
        ...data,
        local_id: selectedTask?.local_id ?? data.local_id,
        expired_at: expiredAt,
        selectedDay:
          dayValue instanceof Date ? dayValue.toISOString() : data.selectedDay,
        selectedTime: data.selectedTime ?? "",
      };

      if (isEdit && selectedTask) {
        await editTask({
          ...selectedTask,
          ...payload,
          local_id: selectedTask.local_id,
          id: null,
        });
      } else {
        await addTask(payload);
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
    <DrawerComponentBasic<TaskModelI>
      open={open}
      onOpenChange={close}
      title={isEdit ? "Редактировать задачу" : "Добавить задачу"}
      titleIcon={isEdit ? VscEdit : IoMdCheckboxOutline}
      onSubmit={handleSubmitUser}
      buttonHide
      defaultValues={{
        local_id: Number(`201${Date.now() % 10000}`),
        id: null,
        project: selectedProjectID!,
        author: +user?.id,

        content: "",
        //
        status: null,
        tags: null,
        theme: null,
        taskdone: false,

        created_at: new Date(),
        expired_at: null,
        selectedDay: "",
        selectedTime: "",
      }}
    >
      {(form) => {
        const { control, handleSubmit, setValue } = form;

        useEffect(() => {
          if (!isEdit || !selectedTask) return;
          setValue("content", selectedTask.content ?? "");
          setValue(
            "status",
            selectedTask.status != null ? Number(selectedTask.status) : null,
          );

          setValue("selectedDay", selectedTask.selectedDay ?? "");
          setValue("selectedTime", selectedTask.selectedTime ?? "");
        }, [isEdit, selectedTask, setValue]);

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

                {/* DATE + TIME */}
                <div className="flex items-center gap-2">
                  <Controller
                    name="selectedDay"
                    control={control}
                    render={({ field }) => (
                      <CalendarByInput
                        value={field.value}
                        onChange={field.onChange}
                        label="Срок выполнения"
                        isRequired
                        showCalendarIcon={true}
                      />
                    )}
                  />

                  <Controller
                    name="selectedTime"
                    control={control}
                    render={({ field }) => (
                      <TimePickerCustom
                        label="Время выполнения"
                        selectTimeMethod={(v) => field.onChange(v ?? "")}
                        allowToggle
                      />
                    )}
                  />
                </div>

                <Controller
                  name="theme"
                  control={control}
                  render={({ field }) => (
                    <SelectCompoent
                      label="Тема"
                      items={themes.map((theme: any) => ({
                        value: String(theme.local_id),
                        label: theme.name,
                      }))}
                      value={(field.value ?? undefined) as any}
                      onValueChange={(v: any) => field.onChange(v)}
                    />
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <SelectCompoent
                      label="Статус"
                      items={statuses.map((status: any) => ({
                        value: String(status.local_id),
                        label: status.name,
                      }))}
                      value={(field.value ?? undefined) as any}
                      onValueChange={(v: any) => field.onChange(v)}
                    />
                  )}
                />
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <SelectCompoent
                      label="Теги"
                      items={tags.map((tag: any) => ({
                        value: String(tag.local_id),
                        label: tag.name,
                      }))}
                      value={(field.value ?? undefined) as any}
                      onValueChange={(v: any) => field.onChange(v)}
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

export default ModalDeviceAddEdit;

import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";

import { showToast } from "@/utils/showToaster";
import { Controller } from "react-hook-form";
import { VscEdit } from "react-icons/vsc";

import { useState } from "react";
import SelectAvatarCheck from "@/components/ui/select/SelectAvatarCheck";
import TextareaForm from "@/components/ui/input/TextareaForm";
import WeekDayPicker from "@/components/ui/calendar/WeekDayPicker";
import { MonthDayCalendar } from "@/components/ui/calendar/MonthDayCalendar";
import MonthPicker from "@/components/ui/calendar/MonthPicker";
import TimePickerCustom from "@/components/ui/time-picker/TimePickerCustom";
import { IoMdCheckboxOutline } from "react-icons/io";
import SegmentComponent from "@/components/ui/segment/SegmentComponent";
import Button from "@/components/ui/buttons/Button";
import SwitchComponent from "@/components/ui/switch/SwitchComponent";
import Checkbox from "@/components/ui/checkbox/Checkbox";
import { MdInfoOutline } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { acordionAnimate } from "@/plugin/animation-framer/acordionAnimate";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import { membersList } from "@/components/stuctures/projects/members/modals/ModalProjectMemberAddEdit";
import Calendar from "@/components/ui/calendar/Calendar";
import CalendarByInput from "@/components/ui/calendar/CalendarByInput";
import { set } from "zod";
import FileUploadForm from "@/components/ui/file-upload/FileUploadForm";

export interface UseForm {
  // Routine
  routineName: string;
  periodicity: "every_time" | "daily" | "weekly" | "monthly" | "yearly"; // kerak bo‘lsa kengaytirasiz
  period: string;
  description: string;
  time: string;
  weekDays: number[];
  monthDays: number[];
  yearMonths: string[];

  // Task
  taskTitle: string;
  startTimeDay: string;
  startTime: string;
  deadlineTime: string;
  isTeamTask: boolean;
  isRoutineTask: boolean;
  members: string[];
  tema: string[];
  tags: string[];
  files: File[];
  // Notification
  notificationTitle: string;
}

const periodicityOptions = [
  {
    value: "every_time",
    label: "Каждый промежуток времени",
  },
  {
    value: "daily",
    label: "Каждый день",
  },
  {
    value: "weekly",
    label: "Каждый дни недели",
  },
  {
    value: "monthly",
    label: "Каждый дни месяца",
  },
  {
    value: "yearly",
    label: "Каждый дни года",
  },
];
const singleUser = [
  {
    image: "/public/assets/images/avatardev.png",
    value: "1",
    label: "user 1",
  },
  {
    image: "/public/assets/images/avatardev.png",
    value: "2",
    label: "user 2",
  },
  {
    image: "/public/assets/images/avatardev.png",
    value: "3",
    label: "user 3",
  },
  {
    image: "/public/assets/images/avatardev.png",
    value: "4",
    label: "user 4",
  },
  {
    image: "/public/assets/images/avatardev.png",
    value: "5",
    label: "user 5",
  },
];

interface RoleProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    key: string;
    name: string;
  } | null;
}

export const ModalWsBaseAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: RoleProps) => {
  const isEdit = mode === "edit";
  // ------------------------------------------------------- HOOKS

  // ------------------------------------------------------- STATE
  const [tab, setTabs] = useState<"notification" | "task">("task");
  // ------------------------------------------------------- QUERIES
  // ------------------------------------------------------- FUNCTIONS

  const handleSubmitUser = async (data: UseForm) => {
    try {
      if (tab === "notification") {
        isEdit
          ? console.log("UPDATE NOTIFICATION:", initialData?.key, data)
          : console.log("CREATE NOTIFICATION:", data);
        setTabs("task");
      } else {
        isEdit
          ? console.log("UPDATE TASK:", initialData?.key, data)
          : console.log("CREATE TASK:", data);

        setTabs("task");
      }

      if (isEdit) cancelSelection();
      close();
    } catch (error) {
      showToast({ type: "error" });
    }
  };

  return (
    <DrawerComponentBasic<UseForm>
      open={open}
      onOpenChange={() => {
        close();
        setTabs("task");
      }}
      title={
        isEdit
          ? tab === "notification"
            ? "Редактировать напоминание"
            : "Редактировать задачу"
          : tab === "notification"
            ? "Добавить напоминание"
            : "Добавить задачу"
      }
      titleIcon={isEdit ? VscEdit : IoMdCheckboxOutline}
      onSubmit={handleSubmitUser}
      buttonHide
      // Mode-ga qarab default qiymatlar
      defaultValues={{
        // agar routine qoshsa
        routineName: isEdit ? initialData?.name || "" : "",
        periodicity: "monthly",
        period: "",
        description: "",
        time: "",
        weekDays: [],
        monthDays: [],
        yearMonths: [],
        // tasks form
        taskTitle: "",
        startTimeDay: "",
        startTime: "",
        deadlineTime: "",
        isTeamTask: false,
        isRoutineTask: false,
        members: [] as string[],
        tema: [] as string[],
        tags: [] as string[],
        files: [] as File[],
        // notification form
        notificationTitle: "",
      }}
    >
      {(form) => {
        const { setValue, control, watch, handleSubmit } = form;
        const selectedPeriodicity = watch("periodicity");
        const watchedMonthDays = watch("monthDays");
        const watchedWeekDays = watch("weekDays");
        const watchIsRoutineTask = watch("isRoutineTask");
        const watchIsTeam = watch("isTeamTask");

        // Agar barcha 31 kun tanlansa — daily ga o'tkazish
        if (
          selectedPeriodicity === "monthly" &&
          watchedMonthDays &&
          watchedMonthDays.length === 31
        ) {
          setValue("periodicity", "daily");
          setValue("monthDays", []);
        }

        // Agar haftaning barcha 7 kuni tanlansa — daily ga o'tkazish
        if (
          selectedPeriodicity === "weekly" &&
          watchedWeekDays &&
          watchedWeekDays.length === 7
        ) {
          setValue("periodicity", "daily");
          setValue("weekDays", []);
        }

        return (
          <>
            {mode == "add" && (
              <div className="mb-5!">
                <SegmentComponent
                  options={[
                    { value: "task", label: "Создание задачи" },
                    { value: "notification", label: "Создание напоминания" },
                  ]}
                  onChange={(value) => {
                    setTabs(value as "notification" | "task");
                  }}
                  value={tab}
                />
              </div>
            )}
            {tab === "task" ? (
              <div className="flex flex-col gap-5 justify-between">
                <ScrollArea
                  isShow={false}
                  orientation="vertical"
                  className="max-h-[500px]"
                >
                  <div className="pb-30! flex flex-col gap-2.5">
                    <Controller
                      name="taskTitle"
                      control={control}
                      rules={{ required: "Напишите название задачи" }}
                      render={({ field, fieldState }) => {
                        return (
                          <div className="flex flex-col gap-2">
                            <TextareaForm
                              maxLength={1024}
                              label="Контекст задачи"
                              placeholder="Выполнить какую-нибудь задачу"
                              isRequired
                              {...field}
                              error={fieldState.error?.message}
                            />
                          </div>
                        );
                      }}
                    />
                    <div className="flex items-center justify-between ">
                      <Controller
                        name="isTeamTask"
                        control={control}
                        render={({ field }) => (
                          <SwitchComponent
                            field={field}
                            label="Назначить на команду"
                          />
                        )}
                      />

                      <Controller
                        name="isRoutineTask"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center gap-1">
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(e) => field.onChange(e.checked)}
                              label="Рутинная задача"
                            />

                            <MdInfoOutline
                              className="text-(--main-color)"
                              size={20}
                            />
                          </div>
                        )}
                      />
                    </div>
                    {/* routine block */}
                    <AnimatePresence initial={false}>
                      {watchIsRoutineTask && (
                        <motion.div
                          key="routine-accordion"
                          variants={acordionAnimate}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          style={{ overflow: "hidden" }}
                          className="flex flex-col gap-2.5 p-4! border! border-dashed border-[#711CE9]! rounded-[30px]!"
                        >
                          <Controller
                            name="routineName"
                            control={control}
                            render={({ field, fieldState }) => {
                              return (
                                <InputForm
                                  maxLength={255}
                                  label="Название рутинной задачи"
                                  placeholder="Укажите название рутинной задачи"
                                  {...field}
                                  isRequired
                                  error={fieldState.error?.message}
                                  clearMethod={() =>
                                    setValue("routineName", "")
                                  }
                                />
                              );
                            }}
                          />

                          {/* Периодичность */}
                          <Controller
                            name="periodicity"
                            control={control}
                            render={({ field }) => {
                              const selectedOption = periodicityOptions.find(
                                (opt) => opt.value === field.value,
                              );
                              const selectValue = selectedOption
                                ? [selectedOption]
                                : undefined;

                              return (
                                <SelectAvatarCheck
                                  options={periodicityOptions}
                                  label="Периодичность"
                                  placeholder="Выберите периодичность"
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

                          {/* Укажите период */}

                          {/* <TimePickerCustom /> */}
                          {selectedPeriodicity == "every_time" ? (
                            <Controller
                              name="time"
                              control={control}
                              render={({ field }) => (
                                <TimePickerCustom
                                  selectTimeMethod={(v) =>
                                    field.onChange(v ?? "")
                                  }
                                  clearMethod={() => field.onChange("")}
                                  allowToggle
                                />
                              )}
                            />
                          ) : selectedPeriodicity ==
                            "daily" ? null : selectedPeriodicity == "weekly" ? (
                            <Controller
                              name="weekDays"
                              control={control}
                              render={({ field }) => (
                                <WeekDayPicker
                                  value={field.value || []}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          ) : selectedPeriodicity == "monthly" ? (
                            <Controller
                              name="monthDays"
                              control={control}
                              render={({ field }) => (
                                <MonthDayCalendar
                                  selectedDays={field.value ?? []}
                                  onChange={field.onChange}
                                  enableCalendarToggle={true}
                                />
                              )}
                            />
                          ) : selectedPeriodicity == "yearly" ? (
                            <Controller
                              name="yearMonths"
                              control={control}
                              render={({ field }) => (
                                <MonthPicker
                                  value={field.value ?? []}
                                  onChange={field.onChange}
                                  label="Выберите месяцы"
                                  enableCalendarToggle={true}
                                />
                              )}
                            />
                          ) : null}

                          {/* Описание */}
                          <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => {
                              return (
                                <div className="flex flex-col gap-2">
                                  <TextareaForm
                                    label="Описание"
                                    placeholder="Описание рутинной задачи "
                                    {...field}
                                    error={fieldState.error?.message}
                                  />
                                </div>
                              );
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/*  
                    // 
                    // 
                    */}
                    {!watchIsTeam ? (
                      <Controller
                        name="periodicity"
                        control={control}
                        rules={{ required: "Выберите периодичность" }}
                        render={({ field }) => {
                          const selectedOption = singleUser.find(
                            (opt) => opt.value === field.value,
                          );
                          const selectValue = selectedOption
                            ? [selectedOption]
                            : undefined;

                          return (
                            <SelectAvatarCheck
                              options={singleUser}
                              label="Прикреплённые сотрудник"
                              placeholder="Прикрепите сотрудников за задачей"
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
                    ) : (
                      <Controller
                        name="members"
                        control={control}
                        render={({ field }) => (
                          <SelectAvatarCheck
                            label="Прикреплённые команд группы"
                            placeholder="Прикрепите команды за задачей"
                            {...field}
                            mode="team"
                            options={membersList}
                            value={membersList.filter((opt) =>
                              field.value?.includes(opt.value),
                            )}
                            onChange={(selected) =>
                              field.onChange(
                                selected
                                  ? selected.map((item) => item.value)
                                  : [],
                              )
                            }
                          />
                        )}
                      />
                    )}

                    <div className="flex items-center gap-2">
                      <Controller
                        name="startTimeDay"
                        control={control}
                        render={({ field }) => (
                          <CalendarByInput
                            {...field}
                            label="Срок выполнения "
                            isRequired={true}
                            showCalendarIcon={false}
                          />
                        )}
                      />

                      <Controller
                        name="startTime"
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

                    {/* <Controller
                      name="tema"
                      control={control}
                      render={({ field }) => (
                        <SelectAvatarCheck
                          label="Название темы"
                          placeholder="Напишите название темы"
                          {...field}
                          mode="team"
                          options={temaList.map((item) => ({
                            value: item.key,
                            label: item.name,
                            icon: item.icon,
                          }))}
                          value={temaList
                            .filter((opt) => field.value?.includes(opt.key))
                            .map((opt) => ({
                              value: opt.key,
                              label: opt.name,
                              image: "/public/assets/images/avatardev.png",
                            }))}
                          onChange={(selected) =>
                            field.onChange(
                              selected
                                ? selected.map((item) => item.value)
                                : [],
                            )
                          }
                        />
                      )}
                    />
                    <Controller
                      name="tags"
                      control={control}
                      render={({ field }) => (
                        <SelectAvatarCheck
                          label="Теги"
                          placeholder="Укажите соответствущие теги"
                          {...field}
                          mode="team"
                          options={temaList.map((item) => ({
                            value: item.key,
                            label: item.name,
                            icon: item.icon,
                          }))}
                          value={temaList
                            .filter((opt) => field.value?.includes(opt.key))
                            .map((opt) => ({
                              value: opt.key,
                              label: opt.name,
                              image: "/public/assets/images/avatardev.png",
                            }))}
                          onChange={(selected) =>
                            field.onChange(
                              selected
                                ? selected.map((item) => item.value)
                                : [],
                            )
                          }
                        />
                      )}
                    /> */}
                    <Controller
                      name="files"
                      control={control}
                      render={({ field }) => (
                        <FileUploadForm
                          label="Файлы"
                          mode="single"
                          selectFile={(watch("files") as File[]) ?? []}
                          onFilesChange={(val) =>
                            field.onChange(
                              val === null
                                ? []
                                : Array.isArray(val)
                                  ? val
                                  : [val],
                            )
                          }
                        />
                      )}
                    />
                  </div>
                </ScrollArea>

                <div>
                  <Button
                    onClick={handleSubmit(handleSubmitUser)}
                    bg={"brand.500"}
                    type="submit"
                    width="full"
                  >
                    {isEdit ? "Сохранить изменения" : "Создать задачу"}
                  </Button>
                </div>
              </div>
            ) : tab === "notification" ? (
              //
              //
              //
              //
              // Notification inputs
              <div className="flex flex-col gap-5    justify-between">
                <div className="pb-30!">
                  <Controller
                    name="notificationTitle"
                    control={control}
                    render={({ field, fieldState }) => {
                      return (
                        <div className="flex flex-col gap-2">
                          <TextareaForm
                            maxLength={1024}
                            label="Контекст напоминания"
                            placeholder="Начните писать сущность напоминания"
                            isRequired
                            {...field}
                            error={fieldState.error?.message}
                          />
                        </div>
                      );
                    }}
                  />
                </div>
                <div>
                  <Button
                    onClick={handleSubmit(handleSubmitUser)}
                    bg={"brand.500"}
                    type="submit"
                    width="full"
                  >
                    {isEdit ? "Сохранить изменения" : "Создать напоминание"}
                  </Button>
                </div>
              </div>
            ) : null}
            {/* task inputs */}
          </>
        );
      }}
    </DrawerComponentBasic>
  );
};

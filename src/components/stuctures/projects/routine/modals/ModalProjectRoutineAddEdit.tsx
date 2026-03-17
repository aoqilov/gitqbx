import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";

import { showToast } from "@/utils/showToaster";
import { Controller } from "react-hook-form";
import { TbRefreshAlert } from "react-icons/tb";
import { VscEdit } from "react-icons/vsc";

import { useState } from "react";
import SelectAvatarCheck from "@/components/ui/select/SelectAvatarCheck";
import TextareaForm from "@/components/ui/input/TextareaForm";
import WeekDayPicker from "@/components/ui/calendar/WeekDayPicker";
import { MonthDayCalendar } from "@/components/ui/calendar/MonthDayCalendar";
import MonthPicker from "@/components/ui/calendar/MonthPicker";
import TimePickerCustom from "@/components/ui/time-picker/TimePickerCustom";

type UserForm = {
  routineName: string;
  periodicity: string;
  period: string;
  description: string;
  time: string;
  weekDays?: number[];
  monthDays?: number[];
  yearMonths?: string[];
};

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

interface RoleProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    key: string;
    name: string;
  } | null;
}

export const ModalProjectRoutineAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: RoleProps) => {
  console.log(mode);
  console.log(initialData);
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
    }

    close();
  };

  const [selectedTime] = useState<string | undefined>();

  console.log("Selected Time in Modal:", selectedTime);
  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      // Mode-ga qarab dinamik sarlavha va icon
      title={
        isEdit ? "Редактировать рутинной задачи" : "Добавить рутинной задачи"
      }
      titleIcon={isEdit ? VscEdit : TbRefreshAlert}
      buttonLabel={isEdit ? "Сохранить изменения" : "Создать рутинной задачи"}
      onSubmit={handleSubmitUser}
      // Mode-ga qarab default qiymatlar
      defaultValues={{
        routineName: isEdit ? initialData?.name || "" : "",
        periodicity: "monthly",
        period: "",
        description: "",
        time: "",
        weekDays: [],
        monthDays: [],
        yearMonths: [] as string[],
      }}
    >
      {(form) => {
        const { setValue, control, watch } = form;
        const selectedPeriodicity = watch("periodicity");
        const watchedMonthDays = watch("monthDays");
        const watchedWeekDays = watch("weekDays");

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

        console.log("Selected Periodicity in Modal:", selectedPeriodicity);
        return (
          <>
            <div className="flex flex-col gap-5 pb-50!">
              {/* Название рутинной задачи */}
              <Controller
                name="routineName"
                control={control}
                rules={{ required: "Напишите название рутинной задачи" }}
                render={({ field, fieldState }) => {
                  return (
                    <InputForm
                      maxLength={255}
                      label="Название рутинной задачи"
                      placeholder="Укажите название рутинной задачи"
                      {...field}
                      isRequired
                      error={fieldState.error?.message}
                      clearMethod={() => setValue("routineName", "")}
                    />
                  );
                }}
              />

              {/* Периодичность */}
              <Controller
                name="periodicity"
                control={control}
                rules={{ required: "Выберите периодичность" }}
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
                      selectTimeMethod={(v) => field.onChange(v ?? "")}
                      clearMethod={() => field.onChange("")}
                      allowToggle
                    />
                  )}
                />
              ) : selectedPeriodicity == "daily" ? null : selectedPeriodicity ==
                "weekly" ? (
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
            </div>
          </>
        );
      }}
    </DrawerComponentBasic>
  );
};

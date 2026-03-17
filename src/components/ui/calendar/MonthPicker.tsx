import { FC, useEffect, useRef, useState } from "react";
import {
  DayPicker,
  DropdownOption,
  getDefaultClassNames,
  type DropdownProps,
} from "react-day-picker";
import { ru } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useColorMode } from "../provider/color-mode";
import Select from "../select/Select";
import { CustomDayButton } from "./Calendar";
import { Box, Icon } from "@chakra-ui/react";
import { MdClear, MdOutlineCalendarMonth } from "react-icons/md";

// Yil 2024 — fevral 29 kunga ega (kabisa yil)
const BASE_YEAR = 2024;
const startOfYear = new Date(BASE_YEAR, 0, 1);
const endOfYear = new Date(BASE_YEAR, 11, 31);

// "DD.MM" formatiga aylantirish
const dateToDayMonth = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
};

// "DD.MM" dan Date ga aylantirish (yil = 2024)
const dayMonthToDate = (str: string): Date => {
  const [day, month] = str.split(".").map(Number);
  return new Date(BASE_YEAR, month - 1, day);
};

interface MonthPickerProps {
  value?: string[];
  onChange: (dates: string[]) => void;
  label?: string;
  enableCalendarToggle?: boolean;
}

const MonthPicker: FC<MonthPickerProps> = ({
  value = [],
  onChange,
  label: _label,
  enableCalendarToggle = false,
}) => {
  const defaultClassNames = getDefaultClassNames();
  const theme = useColorMode();

  const [month, setMonth] = useState<Date>(startOfYear);
  const [isCalendarOpen, setIsCalendarOpen] = useState(!enableCalendarToggle);
  const containerRef = useRef<HTMLDivElement>(null);

  // string[] → Date[] (DayPicker uchun)
  const selectedDates: Date[] = value.map(dayMonthToDate);

  // Outside click — kalendarni yopish
  useEffect(() => {
    if (!enableCalendarToggle || !isCalendarOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [enableCalendarToggle, isCalendarOpen]);

  const handleSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      onChange([]);
      return;
    }
    const formatted = dates.map(dateToDayMonth).sort((a, b) => {
      const [da, ma] = a.split(".").map(Number);
      const [db, mb] = b.split(".").map(Number);
      return ma !== mb ? ma - mb : da - db;
    });
    onChange(formatted);
  };

  const removeDay = (day: string) => {
    onChange(value.filter((d) => d !== day));
  };

  const clearAll = () => onChange([]);

  const hasDays = value.length > 0;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input / tag strip + toggle button */}
      <div className="flex items-center gap-2 w-full">
        {/* Tag strip */}
        <div
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          className="flex-1 flex items-center gap-1 border! border-(--border-input)! rounded-[30px] px-2.5! py-1.5! min-h-10! overflow-hidden cursor-default"
          style={{ minWidth: 0 }}
        >
          {hasDays ? (
            <div className="flex items-center gap-1 flex-wrap w-full relative pr-6!">
              {value.map((day) => (
                <span
                  key={day}
                  className="flex items-center gap-0.75 px-1.75! py-0.5! rounded-[10px] text-[0.8em] font-medium whitespace-nowrap shrink-0"
                  style={{
                    background: "var(--main-color)",
                    color: "#fff",
                  }}
                >
                  {day}
                  <Icon
                    as={MdClear}
                    fontSize="0.9em"
                    className="cursor-pointer hover:opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDay(day);
                    }}
                  />
                </span>
              ))}
              <Box
                borderWidth={1}
                borderRadius={"full"}
                p={1}
                borderColor={"brand.500"}
                className="absolute right-1 cursor-pointer flex items-center justify-center z-10"
              >
                <Icon
                  as={MdClear}
                  fontSize="1em"
                  color="brand.500"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                />
              </Box>
            </div>
          ) : (
            <span className="text-[0.9em] text-(--subtext-color)!">
              Выберите дни месяца
            </span>
          )}
        </div>

        {/* Calendar toggle button */}
        {enableCalendarToggle && (
          <button
            type="button"
            className="flex items-center justify-center w-9.5 h-9.5 rounded-full border border-(--border-input)! hover:bg-(--hover-color)! transition shrink-0"
            onClick={() => setIsCalendarOpen((prev) => !prev)}
          >
            <Icon
              as={MdOutlineCalendarMonth}
              fontSize={20}
              color={"brand.500"}
            />
          </button>
        )}
      </div>

      {/* Dropdown calendar — absolute */}
      {isCalendarOpen && (
        <div
          className="absolute left-0 z-30 rounded-xl shadow-lg border border-(--border-input)! p-2! min-w-[90%]!"
          style={{ background: "var(--bg-color, #fff)" }}
        >
          <DayPicker
            animate
            mode="multiple"
            classNames={{
              weekday: `text-[var(--subtext-color)]`,
              day: `w-[10px] h-[10px]`,
              today: `${defaultClassNames.today} rounded-[15px] border-[1px]`,
              selected: `${defaultClassNames.selected} font-normal bg-[var(--main-color)] text-[#fff] rounded-[15px]`,
              root: `${defaultClassNames.root} flex justify-center ${
                theme.colorMode == "light" ? "text-[#000]" : "text-[#fff]"
              }`,
              chevron: `${defaultClassNames.chevron} w-[18px]`,
            }}
            selected={selectedDates}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            locale={ru}
            captionLayout="dropdown"
            startMonth={startOfYear}
            endMonth={endOfYear}
            required
            components={{
              YearsDropdown: () => <div style={{ display: "none" }} />,
              // Yil dropdownni yashiramiz, faqat oy dropdown ko'rinadi
              MonthsDropdown: (props: DropdownProps) => {
                const {
                  options,
                  value: dropdownValue,
                  onChange: dropdownOnChange,
                } = props;
                const handleChange = (newValue: {
                  value: string;
                  label: string;
                }) => {
                  if (dropdownOnChange) {
                    dropdownOnChange({
                      target: { value: newValue.value },
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }
                };
                const preparedOptions = (options as Array<DropdownOption>).map(
                  (o) => ({ value: o.value.toString(), label: o.label }),
                );
                return (
                  <div className="w-fit ">
                    <Select
                      value={preparedOptions.find(
                        (o) => o.value == String(dropdownValue),
                      )}
                      onChange={handleChange}
                      options={preparedOptions}
                      size="sm"
                      variant="ghost"
                    />
                  </div>
                );
              },
              DayButton: ({ ...props }) => (
                <CustomDayButton {...props} haveTasksDates={[]} />
              ),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MonthPicker;

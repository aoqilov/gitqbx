import { FC, useEffect, useRef, useState } from "react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useColorMode } from "../provider/color-mode";
import { Box, Icon } from "@chakra-ui/react";
import { MdClear, MdOutlineCalendarMonth } from "react-icons/md";

export type DayPickerValue =
  | Date
  | undefined
  | Array<Date>
  | { from: Date; to: Date };

// December 2024 - 31 kunga ega, month-day picker uchun ishlatiladi
const MONTH_DAY_BASE_YEAR = 2024;
const MONTH_DAY_BASE_MONTH = 11; // December (0-indexed)
const fixedDecember = new Date(MONTH_DAY_BASE_YEAR, MONTH_DAY_BASE_MONTH, 1);

// 1-31 kunlarni Date massiviga aylantirish (December 2024)
const dayNumberToDate = (day: number): Date =>
  new Date(MONTH_DAY_BASE_YEAR, MONTH_DAY_BASE_MONTH, day);

// Date dan kun raqamini olish
const dateToDayNumber = (date: Date): number => date.getDate();

// =============================================
// MonthDayCalendar — faqat 1-31 kun tanlash
// =============================================
interface MonthDayCalendarProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  enableCalendarToggle?: boolean;
}

export const MonthDayCalendar: FC<MonthDayCalendarProps> = ({
  selectedDays = [],
  onChange,
  enableCalendarToggle = false,
}) => {
  const defaultClassNames = getDefaultClassNames();
  const theme = useColorMode();
  const [isCalendarOpen, setIsCalendarOpen] = useState(!enableCalendarToggle);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tanlangan kunlarni Date massiviga aylantirish (DayPicker uchun)
  const selectedDates: Date[] = selectedDays
    .slice()
    .sort((a, b) => a - b)
    .map(dayNumberToDate);

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
    const dayNumbers = dates.map(dateToDayNumber).sort((a, b) => a - b);
    onChange(dayNumbers);
  };

  const removeDay = (day: number) => {
    onChange(selectedDays.filter((d) => d !== day).sort((a, b) => a - b));
  };

  const clearAll = () => onChange([]);

  const hasDays = selectedDays.length > 0;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input / tag strip + toggle button */}
      <div className="flex items-center gap-2 w-full">
        {/* Tag strip — overflow hidden, scrollable */}
        <div
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          className="flex-1 flex items-center gap-1 border! border-(--border-input)! rounded-[30px] px-2.5! py-1.5! min-h-10! overflow-hidden cursor-default"
          style={{ minWidth: 0 }}
        >
          {hasDays ? (
            <div className="flex items-center gap-1 flex-wrap w-full relative pr-6!">
              {selectedDays.map((day) => (
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
            className="flex items-center justify-center w-9.5 h-9.5 rounded-full border border-(--border-input)! hover:bg-(--hover-color) transition shrink-0"
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

      {/* Dropdown calendar — z-index 30, absolute */}
      {isCalendarOpen && (
        <div
          className="absolute  left-0 z-30 rounded-xl shadow-lg border border-(--border-input)! p-2! min-w-[90%]!"
          style={{ background: "var(--bg-color, #fff)" }}
        >
          <DayPicker
            disableNavigation
            animate={false}
            month={fixedDecember}
            defaultMonth={fixedDecember}
            startMonth={fixedDecember}
            endMonth={fixedDecember}
            mode="multiple"
            classNames={{
              month_caption: "hidden",
              nav: "hidden",
              weekdays: "hidden",
              weekday: "hidden",
              day: `w-[32px] h-[32px]`,
              today: `${defaultClassNames.today}`,
              selected: `font-semibold bg-[var(--main-color)] text-[#fff] rounded-[50%]`,
              outside: "invisible pointer-events-none",
              root: `${defaultClassNames.root} flex justify-center ${
                theme.colorMode == "light" ? "text-[#000]" : "text-[#fff]"
              }`,
              chevron: `${defaultClassNames.chevron} w-[18px]`,
            }}
            selected={selectedDates}
            onSelect={handleSelect}
            locale={ru}
            captionLayout="label"
            components={{
              MonthCaption: () => <div style={{ display: "none" }} />,
              DayButton: ({ day, modifiers, ...buttonProps }) => {
                if (modifiers.outside) return <></>;
                return (
                  <DayButton day={day} modifiers={modifiers} {...buttonProps} />
                );
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

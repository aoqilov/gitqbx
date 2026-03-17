import { forwardRef, useCallback, useRef, useState, useEffect } from "react";
import Calendar, { DayPickerValue } from "@/components/ui/calendar/Calendar";
import { MdOutlineCalendarMonth } from "react-icons/md";
import InputRequiredIconTooltip from "@/components/ui/input/InputRequiredIconTooltip";

interface DateTimePickerInputProps {
  // RHF field props
  value?: string | Date;
  onChange?: (date: Date | undefined) => void;
  onBlur?: () => void;
  name?: string;
  // custom props
  timeValue?: string;
  onTimeChange?: (time: string | undefined) => void;
  placeholder?: string;
  enableTimeInput?: boolean;
  label?: string;
  isRequired?: boolean;
  showCalendarIcon?: boolean;
}

const CalendarByInput = forwardRef<HTMLDivElement, DateTimePickerInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      timeValue,
      onTimeChange,
      placeholder = "Выберите дату",
      label,
      isRequired = false,
      showCalendarIcon = true,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string | Date | undefined>(
      value ?? undefined,
    );
    const containerRef = useRef<HTMLDivElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as { current: HTMLDivElement | null }).current = node;
        }
      },
      [ref],
    );

    // Sync with RHF external value changes (e.g. reset)
    useEffect(() => {
      setSelectedDay(value ?? undefined);
    }, [value]);

    // Close on outside click + trigger RHF onBlur
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          onBlur?.();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [onBlur]);

    // Lock body scroll when open
    useEffect(() => {
      document.body.style.overflow = isOpen ? "hidden" : "";
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    const handleDaySelect = (v: DayPickerValue) => {
      setSelectedDay(v as Date | undefined);
      onChange?.(v as Date | undefined);
    };

    const formatDate = (date: Date) =>
      date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    return (
      <>
        {/* Dark overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            onClick={() => {
              setIsOpen(false);
              onBlur?.();
            }}
          />
        )}

        <div ref={setRefs} className="relative flex flex-col min-w-0 w-full">
          {/* Label */}
          {label && (
            <label className="text-(--text-label)! mb-1.25! flex items-center gap-1.5! ml-4! text-[0.85em]!">
              {label}
              {isRequired && (
                <div>
                  <InputRequiredIconTooltip />
                </div>
              )}
            </label>
          )}

          {/* Input row */}
          <div className="flex items-center gap-3">
            {/* Date display input */}
            <div
              className="
                flex items-center
                flex-1 min-w-0 h-10!
                px-4!
                rounded-[22px]
                border! border-(--border-input)!
                bg-transparent
                text-[#aaa]
                text-[0.85em]
                cursor-text
                select-none
                overflow-hidden
              "
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {selectedDay && selectedDay instanceof Date
                ? formatDate(selectedDay)
                : timeValue
                  ? timeValue
                  : placeholder}
            </div>

            {/* Calendar icon button */}
            {showCalendarIcon && (
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="
                w-11 h-11
                flex items-center justify-center
                rounded-full
                hover:border-(--main-color)
                transition-colors duration-200
                cursor-pointer
                group
              "
              >
                <MdOutlineCalendarMonth
                  size={20}
                  className="text-(--main-color)"
                  color={isOpen ? "var(--main-color)" : "var(--text-def)"}
                />
              </button>
            )}
          </div>

          {/* Centered modal calendar */}
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div
                className="
                  pointer-events-auto
                  bg-(--bg-main)
                  rounded-2xl
                  shadow-[0_16px_48px_rgba(0,0,0,0.2)]
                  py-10!
                  px-5!
                  border! border-(--main-color)!
                "
                onClick={(e) => e.stopPropagation()}
              >
                <Calendar
                  selectDay={selectedDay}
                  selectDayMethod={handleDaySelect}
                  mode="single"
                  selectTimeMethod={onTimeChange}
                />
              </div>
            </div>
          )}
        </div>
      </>
    );
  },
);

CalendarByInput.displayName = "CalendarByInput";

export default CalendarByInput;

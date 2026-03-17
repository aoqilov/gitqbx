import { FC, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { Box, Icon } from "@chakra-ui/react";
import { LuClock } from "react-icons/lu";
import InputRequiredIconTooltip from "../input/InputRequiredIconTooltip";

interface TimeInputProps {
  label?: string;
  isRequired?: boolean;
  selectTimeMethod: (v: string | undefined) => void;
  clearMethod?: () => void;
  allowToggle?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const pad = (n: number) => String(n).padStart(2, "0");

const TimePickerCustom: FC<TimeInputProps> = ({
  label,
  isRequired = false,
  selectTimeMethod,
  clearMethod,
  allowToggle = false,
}) => {
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const hourRefs = useRef<(HTMLLIElement | null)[]>([]);
  const minuteRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      const h = hour ?? 0;
      const m = minute ?? 0;
      hourRefs.current[h]?.scrollIntoView({ block: "center" });
      minuteRefs.current[m]?.scrollIntoView({ block: "center" });
    }, 50);
  };

  const handleSelect = (h: number, m: number) => {
    setHour(h);
    setMinute(m);
    selectTimeMethod(`${pad(h)}:${pad(m)}`);
  };

  const handleClear = () => {
    setHour(null);
    setMinute(null);
    setOpen(false);
    selectTimeMethod(undefined);
    clearMethod?.();
  };

  const displayValue =
    hour !== null && minute !== null ? `${pad(hour)}:${pad(minute)}` : "";

  return (
    <div className="flex flex-col relative">
      {label && (
        <label className="text-[var(--text-label)]! mb-1.25! flex items-center gap-1.5! ml-4! text-[0.85em]!">
          {label}
          {isRequired && (
            <div>
              <InputRequiredIconTooltip />
            </div>
          )}
        </label>
      )}

      <div className="relative inline-flex items-center gap-2">
        {/* Input trigger */}
        <Box
          className="flex items-center gap-1 px-3! py-0! m-0! bg-transparent h-10! rounded-[30px] border! border-(--border-input)! cursor-pointer select-none min-w-30 focus:border! focus:border-(--main-color)! outline-none"
          tabIndex={0}
          onClick={() => (open ? setOpen(false) : handleOpen())}
        >
          <span
            className="flex-1 text-center text-[0.95em]"
            style={{
              color: displayValue
                ? "var(--rs-text-primary)"
                : "var(--rs-text-secondary, #aaa)",
            }}
          >
            {displayValue || "чч:мм"}
          </span>
        </Box>

        {/* Clock icon button — faqat allowToggle=true bo'lganda */}
        {allowToggle && (
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointertransition-colors"
            onClick={() => (open ? setOpen(false) : handleOpen())}
          >
            <LuClock
              size={18}
              style={{ color: open ? "var(--main-color)" : "var(--text-def)" }}
            />
          </button>
        )}

        {/* Dropdown panel */}
        {open && (
          <>
            {/* Backdrop — clicking outside closes */}
            <div
              className="fixed inset-0 z-99998 "
              onClick={() => setOpen(false)}
            />
            <div
              className="absolute left-2 top-11 z-99999 flex flex-col rounded-[8px] overflow-hidden shadow-lg border! border-gray-200! bg-(--chakra-colors-bg)"
              style={{ width: 100 }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex">
                {/* Hours column */}
                <ul
                  className=" overflow-y-auto w-40!"
                  style={{ maxHeight: 144, scrollbarWidth: "none" }}
                  onWheel={(e) => e.stopPropagation()}
                >
                  {HOURS.map((h) => (
                    <li
                      key={h}
                      ref={(el) => {
                        hourRefs.current[h] = el;
                      }}
                      className="h-6 leading-6 text-center cursor-pointer text-[12px] "
                      style={{
                        background:
                          hour === h ? "var(--main-color)" : undefined,
                        color: hour === h ? "#fff" : "var(--text-def)",
                        fontWeight: hour === h ? "bold" : undefined,
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(h, minute ?? 0);
                        minuteRefs.current[minute ?? 0]?.scrollIntoView({
                          block: "center",
                        });
                      }}
                    >
                      {pad(h)}
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="w-px bg-gray-200!" />

                {/* Minutes column */}
                <ul
                  className=" overflow-y-auto w-40!"
                  style={{ maxHeight: 144, scrollbarWidth: "none" }}
                  onWheel={(e) => e.stopPropagation()}
                >
                  {MINUTES.map((m) => (
                    <li
                      key={m}
                      ref={(el) => {
                        minuteRefs.current[m] = el;
                      }}
                      className="h-6 leading-6 text-center cursor-pointer text-[12px] px-2"
                      style={{
                        background:
                          minute === m ? "var(--main-color)" : undefined,
                        color: minute === m ? "#fff" : "var(--text-def)",
                        fontWeight: minute === m ? "bold" : undefined,
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(hour ?? 0, m);
                        hourRefs.current[hour ?? 0]?.scrollIntoView({
                          block: "center",
                        });
                      }}
                    >
                      {pad(m)}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Now button */}
              <div className="p-2!">
                <Box
                  className="w-full text-[11px] py-1! border-b! border-(--border-input)! cursor-pointer transition-colors flex items-center justify-center rounded-[4px] bg-[var(--main-color)] text-white"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const now = new Date();
                    const h = now.getHours();
                    const m = now.getMinutes();
                    handleSelect(h, m);
                    setTimeout(() => {
                      hourRefs.current[h]?.scrollIntoView({ block: "center" });
                      minuteRefs.current[m]?.scrollIntoView({
                        block: "center",
                      });
                    }, 50);
                  }}
                >
                  Сейчас
                </Box>
              </div>
            </div>
          </>
        )}

        {/* External clear button */}
        {clearMethod && displayValue && (
          <Box
            borderWidth={1}
            borderRadius={"full"}
            borderColor="brand.500"
            color="#fff"
            className="absolute top-3 right-1.5! flex items-center justify-center p-0.5!"
            onClick={handleClear}
          >
            <Icon as={FaXmark} color="brand.500" fontSize={10} />
          </Box>
        )}
      </div>
    </div>
  );
};

export default TimePickerCustom;

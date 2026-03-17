import { FC } from "react";

interface WeekDayPickerProps {
  value?: number[];
  onChange: (days: number[]) => void;
  label?: string;
}

const WEEK_DAYS = [
  { index: 1, name: "Пн", fullName: "Понедельник" },
  { index: 2, name: "Вт", fullName: "Вторник" },
  { index: 3, name: "Ср", fullName: "Среда" },
  { index: 4, name: "Чт", fullName: "Четверг" },
  { index: 5, name: "Пт", fullName: "Пятница" },
  { index: 6, name: "Сб", fullName: "Суббота" },
  { index: 0, name: "Вс", fullName: "Воскресенье" },
];

const WeekDayPicker: FC<WeekDayPickerProps> = ({
  value = [],
  onChange,
  label,
}) => {
  const toggleDay = (dayIndex: number) => {
    if (value.includes(dayIndex)) {
      onChange(value.filter((d) => d !== dayIndex));
    } else {
      onChange(
        [...value, dayIndex].sort((a, b) => {
          // 0 (воскресенье) в конец
          if (a === 0) return 1;
          if (b === 0) return -1;
          return a - b;
        }),
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-600 ml-4">
          {label}
        </label>
      )}
      <div className="flex gap-2 justify-between">
        {WEEK_DAYS.map((day) => {
          const isSelected = value.includes(day.index);
          console.log(isSelected);
          return (
            <button
              key={day.index}
              type="button"
              onClick={() => toggleDay(day.index)}
              title={day.fullName}
              style={{
                color: isSelected ? "white" : "var(--text-lgray-dgreydark)",
                borderColor: isSelected
                  ? "var(--main-color)"
                  : "var(--border-input)",
              }}
              className={`w-10! h-10! border! rounded-[10px]! 
                    bg-${isSelected ? "[var(--main-color)]" : "transparent"}!
                
                `}
            >
              {day.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekDayPicker;

import { FC, useState } from "react";
import TimePicker from "rc-time-picker";
import "@/assets/css/rc-TimePicker.css";
import IconButton from "../buttons/IconButton";
import { FaXmark } from "react-icons/fa6";

interface TimeInputProps {
  selectTimeMethod: (v: string | undefined) => void;
  clearMethod?: () => void;
}

const TimeInput: FC<TimeInputProps> = ({
  selectTimeMethod,
  clearMethod,
  ...props
}) => {
  const [time, setTime] = useState<string | undefined>();

  const preSelectTimeMethod = (v: any) => {
    console.log(v, "v");
    if (v) {
      const dateAsString = JSON.parse(JSON.stringify(v));
      const date = new Date(dateAsString);

      selectTimeMethod(`${date.getHours()}:${date.getMinutes()}`);
      setTime(v);
    }
  };

  const preClearMethod = () => {
    setTime(undefined);
    selectTimeMethod(undefined);
  };

  return (
    <div className="relative">
      <TimePicker
        showSecond={false}
        placeholder="чч:мм"
        focusOnOpen
        onChange={(v) => preSelectTimeMethod(v)}
        value={time}
      />

      {clearMethod && (
        <div className="absolute top-[8px] right-[5px]">
          {time && (
            <IconButton
              icon={FaXmark}
              onClick={() => preClearMethod()}
              size="2xs"
              variant="solid"
              colorPalette="brand"
              color="#fff"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TimeInput;

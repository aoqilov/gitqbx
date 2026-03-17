import ProgressBarComponent from "@/components/ui/progress/ProgressBarComponent";
import Text from "@/components/ui/typography/Text";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

const ProgressBar = () => {
  const { taskProgress } = useSelector((state: RootState) => state.params);

  const percentage =
    taskProgress.total > 0
      ? Math.round((taskProgress.completed / taskProgress.total) * 100)
      : 0;

  return (
    <div className="w-full! flex flex-col gap-2 px-0.5!">
      <Text color={"var(--subtext-color)"} fontSize={"1em"}>
        Процесс выполнения
      </Text>
      <ProgressBarComponent
        value={percentage}
        height="23px"
        showValueText={true}
      />
    </div>
  );
};

export default ProgressBar;

import PageLayout from "@/components/layouts/page-layout/PageLayout";
import ProgressBar from "@/components/stuctures/workspace/tasks/progress-bar/ProgressBar";
import TitleWithCalendar from "@/components/stuctures/workspace/tasks/title-with-calendar/TitleWithCalendar";
import { useWorkspaceDynamicNames } from "@/hooks/use-workspace-menu/useWorkspaceDynamicNames";
import { RootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import MyProjects from "./my-projects/MyProjects";
import MyTaskList from "./my-task-list/MyTaskList";
import SelfTasksBar from "./self-tasks-bar/SelfTasksBar";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";

const MyTaskView = () => {
  // -------------------------------------- HOOKS
  const { taskPageTitle } = useWorkspaceDynamicNames();
  // -------------------------------------- STATES
  //
  const user = useSelector((state: RootState) => state.user);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedProjectID, setSelectedProjectID] = useState<number | null>(
    null,
  );
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);

  // -------------------------------------- RENDER

  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        <div className="mt-5! sticky top-[calc(0px+0px)] z-10! pt-2! bg-[var(--bg-main)]! min-h-[86px]">
          <TitleWithCalendar
            title={taskPageTitle}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        </div>

        {/* progres-bar */}
        <div className="mt-3.75!">
          <ProgressBar />
        </div>
        <div className="mt-3.75!">
          <SelfTasksBar
            selectProjectID={selectedProjectID}
            setSelectedThemeId={setSelectedThemeId}
          />
        </div>
        {/* projectsbar */}
        <div className="mt-5! sticky top-[95px] z-10  py-1! bg-[var(--bg-main)]! ">
          <MyProjects
            handleGetProjectItem={(projectID) =>
              setSelectedProjectID(projectID)
            }
          />
        </div>
        <div className="mt-4!">
          <MyTaskList
            selectDay={selectedDay}
            selectedProjectID={selectedProjectID}
            selectedThemeId={selectedThemeId}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default MyTaskView;

import PageLayout from "@/components/layouts/page-layout/PageLayout";
import NotificationBox from "@/components/stuctures/workspace/tasks/inner-pages/workspace-base-view/notification-box/NotificationBox";
import ProjectsBar from "@/components/stuctures/workspace/tasks/inner-pages/workspace-base-view/prjojects-bar/ProjectsBar";
import ProgressBar from "@/components/stuctures/workspace/tasks/progress-bar/ProgressBar";
import TaskList from "@/components/stuctures/workspace/tasks/inner-pages/workspace-base-view/task-list/TaskList";
import TitleWithCalendar from "@/components/stuctures/workspace/tasks/title-with-calendar/TitleWithCalendar";
import { useWorkspaceDynamicNames } from "@/hooks/use-workspace-menu/useWorkspaceDynamicNames";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { getTasks } from "@/service/tasks-route";

type TaskTree = any & {
  subtasks: any[];
};

const WorkspaceBaseView = () => {
  const [selectedProjectID, setSelectedProjectID] = useState<number | null>(
    null,
  );
  // ===============================================================-------------------------------------- HOOKS
  const { taskPageTitle } = useWorkspaceDynamicNames();

  // ===============================================================-------------------------------------- STATES
  const listStoreProjects = useSelector(
    (state: RootState) => state.projects.list,
  );
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const formattedDay = moment(selectedDay).format("YYYY-MM-DD");

  // Birinchi marta projects kelganda 1-indeksdagi projectni default tanlash
  useEffect(() => {
    if (listStoreProjects.length > 0 && selectedProjectID === null) {
      setSelectedProjectID(listStoreProjects[0].id);
    }
  }, [listStoreProjects]);

  // ===============================================================-------------------------------------- QUERIES
  const resTasks = useQuery({
    queryKey: ["tasks", formattedDay, selectedProjectID],
    queryFn: async () =>
      getTasks({
        date: formattedDay,
        projectID: +selectedProjectID!,
      }),
    enabled: !!selectedProjectID,
  });

  // ===============================================================-------------------------------------- Functions

  function buildTree(tasks: any[]): TaskTree[] {
    const map: Record<number, TaskTree> = {};
    const roots: TaskTree[] = [];

    tasks.forEach((task) => {
      map[task.id] = { ...task, subtasks: [] };
    });

    tasks.forEach((task) => {
      if (task.parent === 0) {
        roots.push(map[task.id]);
      } else if (map[task.parent]) {
        const { subtasks, ...taskWithoutSubtasks } = map[task.id];
        map[task.parent].subtasks.push(taskWithoutSubtasks);
      }
    });

    return roots;
  }
  const taskTree: TaskTree[] = resTasks?.data?.tasks
    ? buildTree(resTasks.data.tasks)
    : [];
  console.log(taskTree);

  function handleGetProjectItem(projectID: number) {
    setSelectedProjectID(projectID);
  }

  return (
    <PageLayout>
      <div className=" flex flex-col min-h-screen!">
        <div className="mt-5! sticky top-[calc(0px+0px)] z-10! pt-2! bg-[var(--bg-main)]! ">
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
        {/* notification-box */}
        <div className="mt-5! ">
          <NotificationBox />
        </div>
        {/* projectsbar */}
        <div className="mt-5! sticky top-[95px] z-10  py-1! bg-[var(--bg-main)]! ">
          <ProjectsBar
            handleGetProjectItem={handleGetProjectItem}
            selectedProjectID={selectedProjectID}
          />
        </div>
        <div className="mt-4!">
          {selectedProjectID !== null ? (
            <TaskList
              taskTree={taskTree}
              selectedProjectID={selectedProjectID}
            />
          ) : null}
        </div>
      </div>
    </PageLayout>
  );
};

export default WorkspaceBaseView;

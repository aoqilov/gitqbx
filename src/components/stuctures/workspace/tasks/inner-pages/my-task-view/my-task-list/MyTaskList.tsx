import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import TaskCard from "./components/TaskCard";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTaskProgress } from "@/store/params/params.slice";
import ModalDeviceAddEdit from "../modals/ModalDeviceAddEdit";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import ModalDeviceSubtaskAddEdit from "../modals/ModalDeviceSubtaskAddEdit";

export interface TaskFile {
  id: string;
  name: string;
  size: number; // bytes
  type: "image" | "pdf" | "doc" | "other";
  url: string; // download URL (S3, etc.)
  previewUrl?: string; // optional separate preview URL
}

interface SubTask {
  local_id: number;
  id: number | null;
  project: number;
  author: number;
  content: string;
  created_at: Date;
  parent: number;
  subtaskdone: boolean;
}

export interface Task {
  local_id: number;
  id: number | null;
  project: number;
  author: number;
  content: string;

  status: string;
  tags: string;
  theme: string;

  taskdone: boolean;

  created_at: Date;
  expired_at: Date | null;

  selectedDay: Date;
  selectedTime: string;

  subtasks: SubTask[];
}

const MyTaskList = ({
  selectDay,
  selectedProjectID,
  selectedThemeId,
}: {
  selectDay: Date;
  selectedProjectID: number | null;
  selectedThemeId: number | null;
}) => {
  // hooks/useFileActions.ts

  const dispatch = useDispatch();

  // ----------------------------------------  HOOKS
  const { isReady: isReadySubtask, getAll: getAllSubtasks } = useIndexedDB({
    dbName: "deviceDB",
    storeName: "subtasks",
  });

  useEffect(() => {
    if (!isReadySubtask) return;
    getAllSubtasks()
      .then((data) => {
        console.log("Subtasks-------------:", data);
      })
      .catch(console.error);
  }, [
    isReadySubtask,
    getAllSubtasks,
    selectedProjectID,
    selectedThemeId,
    selectDay,
  ]);

  const { isReady, getAll } = useIndexedDB({
    dbName: "deviceDB",
    storeName: "tasks",
  });

  const loadTasks = useCallback(() => {
    if (!isReady || !isReadySubtask) return;

    Promise.all([getAll(), getAllSubtasks()])
      .then(([tasks, subtasks]) => {
        const selectedDate = new Date(selectDay);

        const filtered = tasks
          .filter((task: any) => {
            const createdRaw = task.created_at ?? null;
            if (!createdRaw) return false;

            const created = new Date(createdRaw);
            const expiredRaw = task.expired_at ?? null;
            const expired = expiredRaw ? new Date(expiredRaw) : null;

            const inProject =
              !selectedProjectID || task.project === selectedProjectID;

            let inDateRange = false;
            if (expired) {
              inDateRange = selectedDate >= created && selectedDate <= expired;
            } else {
              inDateRange =
                selectedDate.toDateString() === created.toDateString();
            }

            return inProject && inDateRange;
          })
          .map((task: any) => ({
            ...task,
            // ✅ parent === task.local_id bo'lgan subtask'larni qo'shish
            subtasks: subtasks.filter(
              (sub: any) => sub.parent === task.local_id,
            ),
          }));

        setFilteredTasks(filtered as Task[]);

        // for progress bar calculation
        const totalTasks = filtered.length;
        const completedTasks = filtered.filter((t: any) => t.taskdone).length;
        const totalSubtasks = filtered.reduce(
          (sum: number, task: any) => sum + (task.subtasks?.length ?? 0),
          0,
        );
        const completedSubtasks = filtered.reduce(
          (sum: number, task: any) =>
            sum +
            (task.subtasks?.filter((sub: any) => sub.subtaskdone).length ?? 0),
          0,
        );

        dispatch(
          setTaskProgress({
            total: totalTasks + totalSubtasks,
            completed: completedTasks + completedSubtasks,
          }),
        );

        console.log("filtered tasks with subtasks", filtered);
      })
      .catch(console.error);
  }, [
    isReady,
    isReadySubtask,
    getAll,
    getAllSubtasks,
    selectedProjectID,
    dispatch,
    selectedThemeId,
    selectDay,
  ]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!isReady || !isReadySubtask) return;

    const handleDbChange = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | { storeName?: string }
        | undefined;
      if (!detail?.storeName) return;
      if (detail.storeName === "tasks" || detail.storeName === "subtasks") {
        loadTasks();
      }
    };

    window.addEventListener("indexeddb:change", handleDbChange);
    return () => window.removeEventListener("indexeddb:change", handleDbChange);
  }, [isReady, isReadySubtask, loadTasks]);

  // ----------------------------------------  QUERYS
  // ----------------------------------------  STATES
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDBItems, setSelectedDBItems] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  //
  const [modeDB, setModeDB] = useState<"add" | "edit">("add");
  const [openDBModal, setOpenDBModal] = useState(false);
  //
  const [openSubTaskModal, setOpenSubTaskModal] = useState(false);

  // ----------------------------------------  FUNCTIONS
  function handleSubmitAddDB() {
    setModeDB("add");
    setOpenDBModal(true);
  }
  function handleSubmitEditDB() {
    setModeDB("edit");
    setOpenDBModal(true);
  }
  function handleSubmitDeleteDB() {
    console.log("Delete from DB");
  }
  function handleSubmitSubTask() {
    setOpenSubTaskModal(true);
    setModeDB("add");
  }
  function cancelSelection() {
    setIsSelectionMode(false);
    setSelectedDBItems([]);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(selectDay);
  selectedDate.setHours(0, 0, 0, 0);

  const isToday = today.getTime() <= selectedDate.getTime();
  // ----------------------------------------  RENDER
  return (
    <div className="h-250 ">
      <TaskCard
        isSelectionMode={isSelectionMode}
        setIsSelectionMode={setIsSelectionMode}
        setSelectedDBItems={setSelectedDBItems}
        selectedDBItems={selectedDBItems}
        selectedDay={selectDay}
        selectedProjectID={selectedProjectID}
        selectedThemeId={selectedThemeId}
        filteredTasks={filteredTasks}
      />
      {isToday && (
        <TemplateButtons
          isSelectionMode={isSelectionMode}
          selectedCount={selectedDBItems.length}
          onAdd={() => handleSubmitAddDB()}
          onEdit={() => handleSubmitEditDB()}
          onDelete={() => handleSubmitDeleteDB()}
          onClear={() => cancelSelection()}
          onSubTask={() => handleSubmitSubTask()}
          showSubTask={selectedDBItems.length === 1}
        />
      )}
      <ModalDeviceAddEdit
        open={openDBModal}
        close={() => setOpenDBModal(false)}
        selectedTask={selectedDBItems[0] ?? null}
        mode={modeDB}
        cancelSelection={cancelSelection}
        selectedProjectID={selectedProjectID}
      />
      <ModalDeviceSubtaskAddEdit
        open={openSubTaskModal}
        close={() => setOpenSubTaskModal(false)}
        parentTask={selectedDBItems[0] ?? null}
        selectedProjectID={selectedProjectID}
        mode="add"
        cancelSelection={cancelSelection}
        onSaved={() => {
          setOpenSubTaskModal(false);
          cancelSelection();
        }}
      />
    </div>
  );
};

export default MyTaskList;

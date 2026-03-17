import Avatar from "@/components/ui/avatar/Avatar";
import Checkbox from "@/components/ui/checkbox/Checkbox";
import Text from "@/components/ui/typography/Text";
import { Icon, Image, Span } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegClock } from "react-icons/fa";
import { FiPaperclip } from "react-icons/fi";
import { GrDown } from "react-icons/gr";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { useEffect, useRef, useState } from "react";
import { TaskModelI } from "../../modals/ModalDeviceAddEdit";
import type { SubTaskModelI } from "../../modals/ModalDeviceSubtaskAddEdit";
import NoData from "@/components/ui/no-data/NoData";
import { Task } from "../MyTaskList";
import BadgeComponent from "@/components/ui/badge/BadgeComponent";

const TaskCard = ({
  selectedDBItems,
  setSelectedDBItems,
  isSelectionMode,
  setIsSelectionMode,
  selectedDay,
  selectedProjectID,
  selectedThemeId,
  filteredTasks,
}: {
  selectedDBItems: Task[];
  setSelectedDBItems: React.Dispatch<React.SetStateAction<Task[]>>;
  isSelectionMode: boolean;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDay: Date;
  selectedProjectID: number | null;
  selectedThemeId: number | null;
  filteredTasks: Task[];
}) => {
  console.log("selectedDay", selectedDay);
  console.log("selectedProjectID", selectedProjectID);
  console.log("selectedThemeId", selectedThemeId);
  console.log("filteredTasks", filteredTasks);

  // ----------------------------------------  HOOKS
  const { isReady: isStatusReady, getAll: getAllStatuses } = useIndexedDB({
    dbName: "deviceDB",
    storeName: "statuses",
  });

  const { isReady: isTagsReady, getAll: getAllTags } = useIndexedDB({
    dbName: "deviceDB",
    storeName: "tags",
  });
  const { isReady: isThemeReady, getAll: getAllTheme } = useIndexedDB({
    dbName: "deviceDB",
    storeName: "theme",
  });

  useEffect(() => {
    if (!isThemeReady) return;
    getAllTheme().then(setThemes);
  }, [isThemeReady, getAllTheme]);

  useEffect(() => {
    if (!isStatusReady) return;
    getAllStatuses().then(setStatuses);
  }, [isStatusReady, getAllStatuses]);

  useEffect(() => {
    if (!isTagsReady) return;
    getAllTags().then(setTags);
  }, [isTagsReady, getAllTags]);

  const { isReady, edit } = useIndexedDB<TaskModelI>({
    dbName: "deviceDB",
    storeName: "tasks",
  });
  const { isReady: isSubtaskReady, edit: editSubtask } =
    useIndexedDB<SubTaskModelI>({
      dbName: "deviceDB",
      storeName: "subtasks",
    });
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const [openTaskIds, setOpenTaskIds] = useState<Record<number, boolean>>({});

  // ----------------------------------------  QUERYS
  // ----------------------------------------  STATES
  const [localTasks, setLocalTasks] = useState<Task[]>(filteredTasks);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  console.log("statuses", statuses);
  console.log("tags", tags);
  console.log("themes", themes);

  useEffect(() => {
    setLocalTasks(filteredTasks);
  }, [filteredTasks]);

  console.log("localTasks", localTasks);
  // ----------------------------------------  FUNCTIONS
  const handleToggleTask = async (taskId: number, value: boolean) => {
    try {
      const target = localTasks.find((task) => task.local_id === taskId);
      if (!target) return;

      const updatedLocalTask: Task = {
        ...target,
        taskdone: value,
      };

      setLocalTasks((prev) =>
        prev.map((task) =>
          task.local_id === taskId ? updatedLocalTask : task,
        ),
      );

      // prepare object for IndexedDB: omit runtime-only fields (like subtasks) and ensure id fits TaskModelI (null)
      const { subtasks, ...rest } = target as any;
      const dbTask: TaskModelI = {
        ...rest,
        id: null,
        taskdone: value,
      };

      if (!isReady) return;
      await edit(dbTask);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleSubtask = async (
    taskId: number,
    subtaskId: number,
    value: boolean,
  ) => {
    try {
      const currentTask = localTasks.find((task) => task.local_id === taskId);
      if (!currentTask) return;

      const updatedSubtasks = currentTask.subtasks?.map((sub) =>
        sub.local_id === subtaskId ? { ...sub, subtaskdone: value } : sub,
      );
      const allSubtasksDone = updatedSubtasks?.every((sub) => sub.subtaskdone);

      setLocalTasks((prev) =>
        prev.map((task) => {
          if (task.local_id !== taskId) return task;
          return {
            ...task,
            subtasks: updatedSubtasks,
            taskdone: Boolean(allSubtasksDone),
          };
        }),
      );

      if (!isSubtaskReady) return;
      const target = currentTask.subtasks?.find(
        (sub) => sub.local_id === subtaskId,
      );
      if (!target) return;

      const payload: SubTaskModelI = {
        ...target,
        id: null,
        subtaskdone: value,
      };

      await editSubtask(payload);

      if (!isReady) return;
      const { subtasks, ...rest } = currentTask as any;
      const dbTask: TaskModelI = {
        ...rest,
        id: null,
        taskdone: Boolean(allSubtasksDone),
      };
      await edit(dbTask);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);

    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return `${mm}.${dd}  ${hh}:${min}`;
  };

  const handlePressStart = (item: Task) => {
    pressTimer.current = setTimeout(() => {
      setIsSelectionMode(true);
      setSelectedDBItems([item]);
    }, 800);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const getTaskKey = (item: Task) =>
    item.local_id ?? (item.id as number | null) ?? 0;

  const handleCheckboxChange = (item: Task) => {
    setSelectedDBItems((prev) => {
      const itemKey = getTaskKey(item);
      const isSelected = prev.some(
        (selected) => getTaskKey(selected) === itemKey,
      );
      if (selectedDBItems.length === 1 && isSelected) {
        pressTimer.current = null;
      }

      if (isSelected) {
        const newItems = prev.filter(
          (selected) => getTaskKey(selected) !== itemKey,
        );
        if (newItems.length === 0) {
          setIsSelectionMode(false);
        }
        return newItems;
      } else {
        return [...prev, item];
      }
    });
  };

  const toggleTaskOpen = (taskId: number) => {
    setOpenTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const normalizeIds = (value: unknown): Array<string | number> => {
    if (Array.isArray(value)) return value as Array<string | number>;
    if (typeof value === "string") {
      if (value.includes(",")) {
        return value.split(",").map((v) => v.trim());
      }
      return value ? [value] : [];
    }
    if (typeof value === "number") return [value];
    return [];
  };

  const findByLocalId = (list: any[], id: string | number | null | undefined) =>
    list.find((item) => String(item?.local_id) === String(id));

  // ----------------------------------------  RENDER
  return (
    <div className="flex flex-col gap-4 text-black!">
      {localTasks.length === 0 && (
        <div className="flex flex-col items-center ">
          <NoData
            title="Нет задач на этот день"
            description="Похоже, что у вас нет задач, запланированных на этот день. Вы можете создать новую задачу, нажав на кнопку 'Добавить задачу'."
          />
          {/* <Image
            mt={"-60px"}
            ml={"100px"}
            src={"/public/assets/images/strelka-add.png"}
            w={"140px"}
            alt="Стрелка"
          /> */}
        </div>
      )}
      {localTasks.map((task) => {
        const isSelected = selectedDBItems.some(
          (selected) => getTaskKey(selected) === getTaskKey(task),
        );
        const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
        const completedSubtasks = task.subtasks
          ? task.subtasks.filter((sub) => sub.subtaskdone).length
          : 0;
        const progress =
          totalSubtasks > 0
            ? Math.round((completedSubtasks / totalSubtasks) * 100)
            : 0;
        const hasSubtasks = totalSubtasks > 0;
        const allSubtasksDone =
          hasSubtasks && completedSubtasks === totalSubtasks;
        const isOpen = openTaskIds[task.local_id] ?? true;

        const themeItem = findByLocalId(themes, task.theme);
        const statusItem = findByLocalId(statuses, task.status);
        const tagIds = normalizeIds(task.tags);
        const tagItems = tagIds
          .map((id) => findByLocalId(tags, id))
          .filter(Boolean);

        return (
          <div
            onMouseDown={() => handlePressStart(task)}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={() => handlePressStart(task)}
            onTouchEnd={handlePressEnd}
            onClick={() => {
              if (isSelectionMode) {
                handleCheckboxChange(task);
              }
            }}
            className={`px-2.5! py-4! border-2!  border-(--main-color)! rounded-[10px]! flex gap-3 ${isSelected ? "border-solid" : "border-dashed"}`}
          >
            <AnimatePresence>
              {isSelectionMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: "auto" }}
                  exit={{ opacity: 0, scale: 0.8, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className=" flex items-center justify-center "
                >
                  <Checkbox
                    colorPalette={"green"}
                    label=""
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(task);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {/* left side */}
            <div className="flex flex-col gap-2 w-12.5">
              <div className="flex items-center  justify-center">
                <Checkbox
                  label=""
                  disabled={isSelectionMode || hasSubtasks}
                  checked={
                    hasSubtasks ? allSubtasksDone : Boolean(task.taskdone)
                  }
                  onCheckedChange={(e) => {
                    if (hasSubtasks) return;
                    handleToggleTask(task.local_id, Boolean(e?.checked));
                  }}
                />
              </div>
              <div className="flex items-center  justify-center">
                <Avatar
                  avatar="https://via.placeholder.com/150"
                  fullName="A B"
                  className="w-7.5! h-7.5!"
                />
              </div>
            </div>
            <div className="flex-1! flex flex-col">
              {/* right side */}
              <div className="">
                <Text fontSize={"1em"}>{task.content}</Text>
              </div>
              <div className="mt-2! flex items-center justify-between w-full!  ">
                {/* COUNT SUBTASKS */}
                {hasSubtasks && (
                  <div className="  flex gap-2 items-center">
                    <Icon as={FiPaperclip} color="brand.400" fontSize="12px" />
                    <div className="flex gap-1 items-center ">
                      <Span color={"brand.500"} fontSize={"0.85em"}>
                        {completedSubtasks}
                      </Span>
                      /
                      <Span color={"brand.500"} fontSize={"0.85em"}>
                        {totalSubtasks}
                      </Span>
                      <Span color={"brand.500"} fontSize={"0.85em"}>
                        ( {progress}% )
                      </Span>
                    </div>
                    <div
                      className="ml-2! w-3.75! h-3.75! bg-(--main-color)! flex items-center justify-center rounded-[5px]! cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskOpen(task.local_id);
                      }}
                    >
                      <Icon
                        as={GrDown}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s",
                        }}
                        color={"white"}
                        fontSize={10}
                      />
                    </div>
                  </div>
                )}
                {/* TIME EXPIRED */}
                <div className="flex flex-1 items-center gap-1.5  justify-end ">
                  <Icon as={FaRegClock} color={"error.500"} />
                  <Text fontSize="0.875em" color={"error.500"}>
                    {task.expired_at
                      ? `до ${formatDate(task.expired_at)}`
                      : "Дневной"}
                  </Text>
                </div>
              </div>
              <div className="mt-2! flex items-center gap-2">
                {/* theme */}
                {themeItem && (
                  <div>
                    <BadgeComponent
                      text={themeItem.name ?? ""}
                      variant="solid"
                      color="#a0aec0"
                    />
                  </div>
                )}
                {/* tags */}
                {tagItems.map((tag) => (
                  <div key={tag.local_id}>
                    <BadgeComponent
                      text={tag.name ?? ""}
                      color={tag.color ?? "#e2e8f0"}
                      variant="solid"
                    />
                  </div>
                ))}
                {/* stause */}
                {statusItem && (
                  <div>
                    <BadgeComponent
                      text={statusItem.name ?? ""}
                      color={statusItem.color ?? "#e2e8f0"}
                      variant="solid"
                    />
                  </div>
                )}
              </div>
              {/* subtasks--------------------------- */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="border-l! border-(--main-color)! pl-2.5! mt-2.5!"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {task.subtasks &&
                        task.subtasks.map((sub) => (
                          <div
                            key={sub.local_id}
                            className="flex items-center justify-between w-full py-3! px-2! border-b! rounded-none!"
                            style={{
                              transition:
                                "background-color 0.2s, border-color 0.2s",
                            }}
                          >
                            <div className="flex items-center flex-1 min-w-0">
                              <Checkbox
                                size="sm"
                                className="border-gray-400!"
                                checked={sub.subtaskdone}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleToggleSubtask(
                                    task.local_id,
                                    sub.local_id,
                                    !sub.subtaskdone,
                                  );
                                }}
                              />

                              <Text
                                fontSize="0.85em"
                                fontWeight={500}
                                color="var(--text-def)"
                                whiteSpace="wrap"
                                lineClamp={2}
                                textDecoration={
                                  sub.subtaskdone ? "line-through" : "none"
                                }
                              >
                                {sub.content}
                              </Text>
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskCard;

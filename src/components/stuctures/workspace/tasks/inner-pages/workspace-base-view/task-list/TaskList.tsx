import Avatar from "@/components/ui/avatar/Avatar";
import AvatarGroupComponent from "@/components/ui/avatar/AvatarGroupComponent";
import Checkbox from "@/components/ui/checkbox/Checkbox";
import Text from "@/components/ui/typography/Text";
import { Icon } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { FaBriefcase, FaHeartbeat, FaRegClock } from "react-icons/fa";
import { FiPaperclip } from "react-icons/fi";
import { GoEye, GoFile } from "react-icons/go";
import { GrDown } from "react-icons/gr";
import { MdOutlineFileDownload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setTaskProgress } from "@/store/params/params.slice";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { ModalWsBaseAddEdit } from "@/components/stuctures/workspace/tasks/inner-pages/workspace-base-view/modals/ModalWsBaseAddEdit";
import { ModalWsBaseDelete } from "@/components/stuctures/workspace/tasks/inner-pages/workspace-base-view/modals/ModalWsBaseDelete";
import { ModalWsBaseSubTaskAdd } from "@/components/stuctures/workspace/tasks/inner-pages/workspace-base-view/modals/ModalWsBaseSubTaskAdd";
import { set } from "zod";
import { se } from "date-fns/locale";
import { ModalWsBaseSubTaskDelete } from "../modals/ModalWsBaseSubTaskDelete";

import { TbBallBasketball } from "react-icons/tb";
import { RiPlantFill } from "react-icons/ri";
import { PiBookFill } from "react-icons/pi";
import { RootState } from "@/store";
import {
  useGetStoreAllProjects,
  useGetStoreAllWorkspace,
  useGetStoreDataByProjectId,
  useGetStoreDataByWorkspaceId,
} from "@/hooks/use-store-data";
import { globalParams } from "@/utils/globalParams";

export const mockTasks = [
  {
    id: 1,
    content: "Setup project structure",
    status: 1,
    author: 1,
    performers: [2, 3],
    teams: [1],
    project: 10,
    expiredAt: "2026-03-15T10:00:00Z",
    tags: [1, 2],
    theme: 1,
    files: [11],
    parent: 0,
    createdAt: "2026-03-01T09:00:00Z",
    subtasks: [
      {
        id: 2,
        content: "Install dependencies",
        status: 1,
        author: 1,
        performers: [2],
        teams: [1],
        project: 10,
        expiredAt: "2026-03-12T10:00:00Z",
        tags: [2],
        theme: 1,
        files: [],
        parent: 1,
        createdAt: "2026-03-01T10:00:00Z",
      },
      {
        id: 3,
        content: "Configure eslint and prettier",
        status: 2,
        author: 1,
        performers: [3],
        teams: [1],
        project: 10,
        expiredAt: "2026-03-13T10:00:00Z",
        tags: [3],
        theme: 1,
        files: [],
        parent: 1,
        createdAt: "2026-03-01T11:00:00Z",
      },
    ],
  },
  {
    id: 4,
    content: "Create authentication module",
    status: 1,
    author: 2,
    performers: [3, 4],
    teams: [1],
    project: 10,
    expiredAt: "2026-03-20T10:00:00Z",
    tags: [4],
    theme: 2,
    files: [12],
    parent: 0,
    createdAt: "2026-03-02T09:00:00Z",
    subtasks: [
      {
        id: 5,
        content: "Login page UI",
        status: 1,
        author: 2,
        performers: [4],
        teams: [1],
        project: 10,
        expiredAt: "2026-03-18T10:00:00Z",
        tags: [4],
        theme: 2,
        files: [],
        parent: 4,
        createdAt: "2026-03-02T10:00:00Z",
      },
    ],
  },
  {
    id: 6,
    content: "Create task board",
    status: 2,
    author: 3,
    performers: [2, 4],
    teams: [2],
    project: 10,
    expiredAt: "2026-03-25T10:00:00Z",
    tags: [5],
    theme: 3,
    files: [],
    parent: 0,
    createdAt: "2026-03-03T09:00:00Z",
    subtasks: [],
  },
  {
    id: 7,
    content: "Implement drag and drop",
    status: 1,
    author: 3,
    performers: [2],
    teams: [2],
    project: 10,
    expiredAt: "2026-03-27T10:00:00Z",
    tags: [6],
    theme: 3,
    files: [],
    parent: 0,
    createdAt: "2026-03-04T09:00:00Z",
    subtasks: [
      {
        id: 8,
        content: "Integrate dnd-kit",
        status: 1,
        author: 3,
        performers: [2],
        teams: [2],
        project: 10,
        expiredAt: "2026-03-26T10:00:00Z",
        tags: [6],
        theme: 3,
        files: [],
        parent: 7,
        createdAt: "2026-03-04T10:00:00Z",
      },
    ],
  },
  {
    id: 9,
    content: "API integration",
    status: 1,
    author: 4,
    performers: [1, 3],
    teams: [2],
    project: 10,
    expiredAt: "2026-03-30T10:00:00Z",
    tags: [7],
    theme: 4,
    files: [13],
    parent: 0,
    createdAt: "2026-03-05T09:00:00Z",
    subtasks: [],
  },
];

const mockMembersState: MembersState = {
  list: [
    {
      id: 1,
      user: 1,
      workspace: 1,
      project: 10,
      team: 1,
      type: "member",
      isOwner: true,
      role: 1,
      permissions: [1, 2, 3, 4],
      total_tasks_count: 20,
      completed_tasks_count: 14,
      uncompleted_tasks_count: 6,
      userData: {
        id: 1,
        fullname: "Vladislav Petrov",
        telegram_avatar: "https://i.pravatar.cc/150?img=1",
        first_name: "Vladislav",
        last_name: "Petrov",
        index_quality: 92,
      },
    },
    {
      id: 2,
      user: 2,
      workspace: 1,
      project: 10,
      team: 1,
      type: "member",
      isOwner: false,
      role: 2,
      permissions: [1, 2],
      total_tasks_count: 15,
      completed_tasks_count: 9,
      uncompleted_tasks_count: 6,
      userData: {
        id: 2,
        fullname: "Ali Karimov",
        telegram_avatar: "https://i.pravatar.cc/150?img=2",
        first_name: "Ali",
        last_name: "Karimov",
        index_quality: 85,
      },
    },
    {
      id: 3,
      user: 3,
      workspace: 1,
      project: 10,
      team: 2,
      type: "member",
      isOwner: false,
      role: 3,
      permissions: [1],
      total_tasks_count: 12,
      completed_tasks_count: 5,
      uncompleted_tasks_count: 7,
      userData: {
        id: 3,
        fullname: "Azizbek Tursunov",
        telegram_avatar: "https://i.pravatar.cc/150?img=3",
        first_name: "Azizbek",
        last_name: "Tursunov",
        index_quality: 78,
      },
    },
  ],
};
const tagsMock = [
  {
    id: 3,
    project: 10,
    tag_group: 2,
    name: "Bug",
    color: "#EF4444",
    priority: 1,
  },
  {
    id: 4,
    project: 10,
    tag_group: 2,
    name: "Feature",
    color: "#F59E0B",
    priority: 2,
  },
];
const categories = [
  { id: "health", label: "Здоровье", icon: FaHeartbeat },
  { id: "work", label: "Работа", icon: FaBriefcase },
  { id: "sport", label: "Спорт", icon: TbBallBasketball },
  { id: "household", label: "Хозяйство", icon: RiPlantFill },
  { id: "learning", label: "Обучение", icon: PiBookFill },
];

const TaskList = ({
  taskTree,
  selectedProjectID,
}: {
  taskTree: any;
  selectedProjectID: number;
}) => {
  // -------------------------------------------------   HOOKS
  const { workspaceID } = globalParams();

  const {
    members: membersAll,
    projects: projectAll,
    roles: rolesAll,
  } = useGetStoreAllWorkspace();
  console.log();
  console.log("---------------------------ALL-WORKSPACE  ----------start");
  console.log("all members", membersAll);
  console.log("all projects", projectAll);
  console.log("all roles", rolesAll);
  const {
    members: membersAllProjects,
    roles: rolesAllProjects,
    status: statusAll,
    tags: tagsAll,
    tagsGroup: tagsgroup,
    theme: themeAll,
  } = useGetStoreAllProjects();
  console.log("---------------------------ALL-PROJECTS ----------start");
  console.log("all members", membersAllProjects);
  console.log("all tags group", tagsgroup);
  console.log("all themes", themeAll);
  console.log("all statuses", statusAll);
  console.log("all tags", tagsAll);
  console.log("all role projects", rolesAllProjects);
  const {
    members: wsmembers,
    projects,
    roles: wsroles,
  } = useGetStoreDataByWorkspaceId(+workspaceID!);
  console.log("---------------------------WORKSPACE-BY-ID  ----------start");
  console.log("members:", wsmembers);
  console.log("projects:", projects);
  console.log("roles:", wsroles);

  const { members, roles, tagsGroup, tags, status, theme } =
    useGetStoreDataByProjectId(selectedProjectID);
  console.log("---------------------------PROJECT-BY-ID  ----------start");
  console.log("members:", members);
  console.log("roles:", roles);
  console.log("tagsgroup:", tagsGroup);
  console.log("tags:", tags);
  console.log("theme:", theme);
  console.log("statuses:", status);

  //

  // -------------------------------------- REFS
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------------------------- STATES

  // // Har bir task uchun alohida open/close holati
  const [openTaskIds, setOpenTaskIds] = React.useState<Record<string, boolean>>(
    {},
  );

  // // Selection mode — RolesView andozasi bilan bir xil
  // const [isSelectionMode, setIsSelectionMode] = React.useState(false);
  // const [selectedItems, setSelectedItems] = React.useState<TaskMock[]>([]);

  // // Modal states
  // const [openModal, setOpenModal] = React.useState(false);
  // const [modalDelete, setModalDelete] = React.useState(false);
  // const [modalSubTask, setModalSubTask] = React.useState(false);
  // const [subTaskModalMode, setSubTaskModalMode] = React.useState<
  //   "add" | "edit"
  // >("add");
  // const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  // const [modalSubTaskDelete, setModalSubTaskDelete] = useState(false);

  // // Har bir task uchun main completed holati
  // const [taskStates, setTaskStates] = React.useState<Record<string, boolean>>(
  //   () => {
  //     const initial: Record<string, boolean> = {};
  //     taskMockData.forEach((task) => {
  //       initial[task.id] = false;
  //     });
  //     return initial;
  //   },
  // );

  // // SubTask completed holatlari
  // const [subTaskStates, setSubTaskStates] = React.useState<
  //   Record<string, Record<string, boolean>>
  // >(() => {
  //   const initial: Record<string, Record<string, boolean>> = {};
  //   taskMockData.forEach((task) => {
  //     initial[task.id] = {};
  //     task.subTasks.forEach((sub) => {
  //       initial[task.id][sub.id] = sub.completed;
  //     });
  //   });
  //   return initial;
  // });

  // // -------------------------------------- EFFECTS

  // useEffect(() => {
  //   const total = taskMockData.length;
  //   const completed = taskMockData.filter((task) => {
  //     if (task.subTasks.length > 0) {
  //       return task.subTasks.every(
  //         (sub) => subTaskStates[task.id]?.[sub.id] ?? sub.completed,
  //       );
  //     }
  //     return taskStates[task.id] ?? false;
  //   }).length;
  //   dispatch(setTaskProgress({ total, completed }));
  // }, [taskStates, subTaskStates, dispatch]);

  // // -------------------------------------- SELECTION FUNCTIONS (RolesView andozasi)

  // const handlePressStart = (task: TaskMock) => {
  //   pressTimer.current = setTimeout(() => {
  //     setIsSelectionMode(true);
  //     setSelectedItems([task]);
  //     setIsSubTaskSelectionMode(false); // + shu
  //     setSelectedSubTasks([]); // + shu
  //   }, 800);
  // };

  // const handlePressEnd = () => {
  //   if (pressTimer.current) {
  //     clearTimeout(pressTimer.current);
  //     pressTimer.current = null;
  //   }
  // };

  // const handleCheckboxChange = (task: TaskMock) => {
  //   setSelectedItems((prev) => {
  //     const isSelected = prev.some((s) => s.id === task.id);
  //     if (isSelected) {
  //       const newItems = prev.filter((s) => s.id !== task.id);
  //       if (newItems.length === 0) {
  //         setIsSelectionMode(false);
  //       }
  //       return newItems;
  //     } else {
  //       return [...prev, task];
  //     }
  //   });
  // };

  // const cancelSelection = () => {
  //   setIsSelectionMode(false);
  //   setSelectedItems([]);
  //   setIsSubTaskSelectionMode(false); // + shu
  //   setSelectedSubTasks([]); // + shu
  //   setModalDelete(false);
  //   setModalSubTask(false);
  //   setOpenModal(false);
  //   setSubTaskModalMode("add");
  //   setModalMode("add");
  // };

  // // -------------------------------------- MODAL FUNCTIONS

  // function handleSubmitAdd() {
  //   setModalMode("add");
  //   setOpenModal(true);
  // }

  // function handleSubmitEdit() {
  //   setModalMode("edit");
  //   setOpenModal(true);
  // }

  // function handleSubmitDelete() {
  //   setModalDelete(true);
  // }

  // function handleSubmitSubTask() {
  //   setSubTaskModalMode("add");
  //   setModalSubTask(true);
  // }
  // function handleSubmitSubTaskEdit() {
  //   setSubTaskModalMode("edit");
  //   setModalSubTask(true);
  // }
  // function handleSubmitSubTaskDelete() {
  //   setModalSubTaskDelete(true);
  // }

  // // -------------------------------------- TASK HELPERS

  const toggleTaskOpen = (taskId: number) => {
    setOpenTaskIds((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // const toggleTask = (taskId: string) => {
  //   setTaskStates((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  // };

  // const toggleSubTask = (taskId: string, subTaskId: string) => {
  //   setSubTaskStates((prev) => ({
  //     ...prev,
  //     [taskId]: {
  //       ...prev[taskId],
  //       [subTaskId]: !prev[taskId][subTaskId],
  //     },
  //   }));
  // };

  // const isAllSubTasksCompleted = (task: TaskMock): boolean => {
  //   if (task.subTasks.length === 0) return false;
  //   return task.subTasks.every(
  //     (sub) => subTaskStates[task.id]?.[sub.id] ?? sub.completed,
  //   );
  // };

  // const getCompletedCount = (task: TaskMock): number => {
  //   return task.subTasks.filter(
  //     (sub) => subTaskStates[task.id]?.[sub.id] ?? sub.completed,
  //   ).length;
  // };

  // // Modal uchun kerakli ma'lumotlar
  // const selectedTaskObjects = selectedItems.map((t) => ({
  //   key: t.id,
  //   name: t.title,
  // }));
  // const singleSelected = selectedItems.length === 1 ? selectedItems[0] : null;
  // const modalEditData = singleSelected
  //   ? { key: singleSelected.id, name: singleSelected.title }
  //   : null;

  // // -------------------------------------  SUBTASK SELECTION
  // // SubTask selection states
  // const [isSubTaskSelectionMode, setIsSubTaskSelectionMode] =
  //   React.useState(false);
  // const [selectedSubTasks, setSelectedSubTasks] = React.useState<
  //   { taskId: string; subTask: SubTask }[]
  // >([]);
  // const subTaskPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const handleSubTaskPressStart = (task: TaskMock, subTask: SubTask) => {
  //   subTaskPressTimer.current = setTimeout(() => {
  //     setIsSubTaskSelectionMode(true);
  //     setSelectedSubTasks([{ taskId: task.id, subTask }]);
  //     setIsSelectionMode(false); // Main task selection mode-ni o‘chirish
  //     setSelectedItems([]); // Main task selection-ni tozalash
  //   }, 1000);
  // };

  // const handleSubTaskPressEnd = () => {
  //   if (subTaskPressTimer.current) {
  //     clearTimeout(subTaskPressTimer.current);
  //     subTaskPressTimer.current = null;
  //   }
  // };

  // const handleSubTaskCheckboxChange = (task: TaskMock, subTask: SubTask) => {
  //   setSelectedSubTasks((prev) => {
  //     const isSelected = prev.some((s) => s.subTask.id === subTask.id);
  //     if (isSelected) {
  //       const newItems = prev.filter((s) => s.subTask.id !== subTask.id);
  //       if (newItems.length === 0) setIsSubTaskSelectionMode(false);
  //       return newItems;
  //     }
  //     return [...prev, { taskId: task.id, subTask }];
  //   });
  // };

  // const cancelSubTaskSelection = () => {
  //   setIsSubTaskSelectionMode(false);
  //   setSelectedSubTasks([]);
  // };
  // -------------------------------------- RENDER
  return (
    <>
      <div className="pb-1000! flex flex-col gap-2.5">
        {mockTasks?.map((task) => {
          const isOpen = !!openTaskIds[task.id];
          // const allCompleted = isAllSubTasksCompleted(task);
          // const completedCount = getCompletedCount(task);
          // const hasSubTasks = task.subTasks.length > 0;
          // const isSelected = selectedItems.some((s) => s.id === task.id);

          return (
            <div
              key={task.id}
              // onMouseDown={() => handlePressStart(task)}
              // onMouseUp={handlePressEnd}
              // onMouseLeave={handlePressEnd}
              // onTouchStart={() => handlePressStart(task)}
              // onTouchEnd={handlePressEnd}
              // onClick={() => {
              //   if (isSelectionMode) {
              //     handleCheckboxChange(task);
              //   }
              // }}
              style={{
                transition: "background-color 0.2s, border-color 0.2s",
                userSelect: "none",
              }}
              className={[
                "p-2.5! flex items-start gap-3 border-dashed! border-2! rounded-[10px]! cursor-pointer",
                // isSelected
                //   ? "border-solid! border-(--main-color)! bg-[#aa6eff3e]"
                //   : "border-(--main-color)!",
              ].join(" ")}
            >
              {/* Checkbox va avatarlar */}
              <div className="w-13! flex flex-col items-center justify-center">
                <Checkbox
                  size={"md"}
                  className="ml-2.5!"
                  checked={true}
                  // hasSubTasks ? allCompleted : (taskStates[task.id] ?? false)
                  // disabled={hasSubTasks}
                  // onChange={
                  //   hasSubTasks
                  //     ? undefined
                  //     : (e) => {
                  //         e.stopPropagation();
                  //         toggleTask(task.id);
                  //       }
                  // }
                />

                <div className="mt-1.75!">
                  {/* <AvatarGroupComponent
                    avatars={task?.avatars}
                    size="sm"
                    overlap={-7}
                    max={2}
                    showBorder={true}
                  /> */}
                </div>
              </div>

              {/* main content */}
              <div className="flex-1! flex flex-col gap-1.5 overflow-hidden">
                {/* title */}
                <div>
                  <Text fontSize="1em" fontWeight="400">
                    {task.content}
                  </Text>
                </div>

                {/* File triger-button and time  */}
                <div
                  className={`flex items-center ${
                    task?.files?.length > 0 ? "justify-between" : "justify-end"
                  } w-full`}
                >
                  {task?.files?.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Icon as={FiPaperclip} color={"brand.500"} />
                      <Text fontSize="0.875em" color={"brand.500"}>
                        {/* {completedCount} / {task.subTasks.length} (
                        {task.subTasks.length > 0
                          ? Math.round(
                              (completedCount / task.subTasks.length) * 100,
                            )
                          : 0}{" "}
                        %) */}
                        1111111
                      </Text>
                      <div
                        className="ml-2! w-3.75! h-3.75! bg-(--main-color)! flex items-center justify-center rounded-[5px]! cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskOpen(task.id);
                        }}
                      >
                        <Icon
                          as={GrDown}
                          style={{
                            transform: isOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s",
                          }}
                          color={"white"}
                          fontSize={10}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Icon as={FaRegClock} color={"error.500"} />
                    <Text fontSize="0.875em" color={"error.500"}>
                      до {task.expiredAt.split("T")[1].slice(0, 5)}
                    </Text>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1 w-full">
                  {/* {task.tags.map((tag) => {
                    return (
                      <div
                        key={tag.id}
                        className={`${tag.color} h-5.25 px-2! rounded-full flex items-center`}
                      >
                        <Text color="white" whiteSpace="nowrap">
                          {tag.label}
                        </Text>
                      </div>
                    );
                  })} */}
                  <Text>tags</Text>
                </div>

                {/*additional */}
                <AnimatePresence initial={false}>
                  {/* {isOpen && ( */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    {/* Fayl view / download */}
                    {/* {task?.files?.length > 0 && (
                        <div
                          key={task.files[0].id}
                          className="flex justify-between border! border-(--main-color)! px-2.5! py-1.5! rounded-[5px]!"
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon
                              as={GoFile}
                              color={"brand.500"}
                              fontSize={16}
                            />
                            <div className="flex flex-col">
                              <Text fontSize={"0.72em"}>
                                {task.files[0].name}
                              </Text>
                              <Text
                                fontSize={"0.8em"}
                                color={"var(--subtext-color)"}
                              >
                                {task.files[0].size}
                              </Text>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div
                              className="p-1! flex items-center justify-center bg-(--main-color)! rounded-full! cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("view");
                              }}
                            >
                              <Icon as={GoEye} color={"white"} fontSize={16} />
                            </div>
                            <div
                              className="p-1! flex items-center justify-center border! border-(--main-color)! rounded-full! cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("download");
                              }}
                            >
                              <Icon
                                as={MdOutlineFileDownload}
                                color={"brand.500"}
                                fontSize={16}
                              />
                            </div>
                          </div>
                        </div>
                      )} */}

                    {/* SubTasks */}
                    {task.subtasks.map((subTask) => {
                      // const isSubCompleted =
                      //   subTaskStates[task.id]?.[subTask.id] ??
                      //   subTask.completed;
                      // const isSubSelected = selectedSubTasks.some(
                      //   (s) => s.subTask.id === subTask.id,
                      // );

                      return (
                        <div
                          key={subTask.id}
                          className="border-l! border-(--main-color)! pl-2.5! mt-2.5!"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            // handleSubTaskPressStart(task, subTask);
                          }}
                          onMouseUp={(e) => {
                            e.stopPropagation();
                            // handleSubTaskPressEnd();
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            // handleSubTaskPressEnd();
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            // handleSubTaskPressStart(task, subTask);
                          }}
                          onTouchEnd={(e) => {
                            e.stopPropagation();
                            // handleSubTaskPressEnd();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // if (isSubTaskSelectionMode)
                            //   handleSubTaskCheckboxChange(task, subTask);
                          }}
                        >
                          <div
                            className="flex items-center justify-between w-full py-3! border-b!"
                            style={{
                              transition:
                                "background-color 0.2s, border-color 0.2s",
                              borderRadius: "6px",
                              // padding: isSubSelected ? "4px 6px" : undefined,
                              // backgroundColor: isSubSelected
                              //   ? "#aa6eff3e"
                              //   : undefined,
                              // border: isSubSelected
                              //   ? "1px solid #711CE9"
                              //   : undefined,
                            }}
                          >
                            <div className="flex items-center flex-1 min-w-0">
                              <Checkbox
                                size="sm"
                                className="border-gray-400!"
                                // checked={isSubCompleted}
                                checked={true}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  // if (isSubTaskSelectionMode) {
                                  //   handleSubTaskCheckboxChange(
                                  //     task,
                                  //     subTask,
                                  //   );
                                  // } else {
                                  //   toggleSubTask(task.id, subTask.id);
                                  // }
                                }}
                              />
                              <Text
                                fontSize={"0.85em"}
                                fontWeight={500}
                                color={"var(--text-def)"}
                                whiteSpace="wrap"
                                lineClamp={2}
                                // textDecoration={
                                //   isSubCompleted ? "line-through" : "none"
                                // }
                              >
                                {subTask.content}
                              </Text>
                            </div>
                            {/* <Avatar
                              className="ml-2!"
                              size={"xs"}
                              avatar={subTask.assignee.avatar}
                              fullName={subTask.assignee.fullName}
                            /> */}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                  {/* )} */}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION BUTTONS */}
      {/* agar subtask-selection-mode true */}
      {/* {isSubTaskSelectionMode && (
        <TemplateButtons
          isSelectionMode={isSubTaskSelectionMode}
          selectedCount={selectedSubTasks.length}
          onAdd={handleSubmitSubTask}
          onEdit={handleSubmitSubTaskEdit}
          onDelete={handleSubmitSubTaskDelete}
          onClear={cancelSubTaskSelection}
        />
      )} */}

      {/* agar subtask-selection-mode false */}
      {/* {!isSubTaskSelectionMode && (
        <TemplateButtons
          isSelectionMode={isSelectionMode}
          selectedCount={selectedItems.length}
          onAdd={handleSubmitAdd}
          onEdit={handleSubmitEdit}
          onDelete={handleSubmitDelete}
          onClear={cancelSelection}
          onSubTask={handleSubmitSubTask}
          showSubTask={true}
        />
      )} */}

      {/* Add edit modal
      <ModalWsBaseAddEdit
        open={openModal}
        close={() => {
          setOpenModal(false);
          setModalMode("add");
        }}
        mode={modalMode}
        initialData={null}
        cancelSelection={cancelSelection}
      /> */}

      {/* Delete modal */}
      {/* <ModalWsBaseDelete
        open={modalDelete}
        close={() => setModalDelete(false)}
        selectedItems={selectedTaskObjects}
        cancelSelection={cancelSelection}
      /> */}

      {/* SubTask modal */}
      {/* <ModalWsBaseSubTaskAdd
        open={modalSubTask}
        close={() => {
          setModalSubTask(false);
        }}
        mode={subTaskModalMode}
        initialData={modalEditData}
        cancelSelection={cancelSelection}
      />
      <ModalWsBaseSubTaskDelete
        open={modalSubTaskDelete}
        close={() => setModalSubTaskDelete(false)}
        selectedItems={selectedSubTasks.map((s) => ({
          key: s.subTask.id,
          name: s.subTask.title,
        }))}
        cancelSelection={cancelSubTaskSelection}
      /> */}
    </>
  );
};

export default TaskList;

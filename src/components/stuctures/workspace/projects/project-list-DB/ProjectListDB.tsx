import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { useEffect, useRef, useState } from "react";
import { LuFolder } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/service/projects-route";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  NormalizedProject,
  fromIDB,
  fromAPI,
  getUID,
  ProjectForIndexedDB,
} from "../types";
import { useTranslation } from "@/i18n/languageConfig";

const ProjectListDB = ({
  searchValue,
  handleSubmitMenu,
  isSelectionMode,
  setIsSelectionMode,
  setSelectedItems,
  selectedItems,
  refreshKey,
}: {
  searchValue: string;
  handleSubmitMenu: (item: ProjectForIndexedDB | Project) => void;
  isSelectionMode: boolean;
  setIsSelectionMode: (value: boolean) => void;
  setSelectedItems: React.Dispatch<
    React.SetStateAction<(ProjectForIndexedDB | Project)[]>
  >;
  selectedItems: (ProjectForIndexedDB | Project)[];
  refreshKey?: number;
}) => {
  const { t } = useTranslation("workspace.pages.projectsws.");
  const { payment } = useSelector((state: RootState) => state.params);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const { isReady, getAll } = useIndexedDB<ProjectForIndexedDB>({
    dbName: "deviceDB",
    storeName: "projects",
  });

  // ----------------------------- STATE
  const [activeItem, setActiveItem] = useState<NormalizedProject | null>(null);
  const [idbProjects, setIdbProjects] = useState<NormalizedProject[]>([]);
  const [idbLoading, setIdbLoading] = useState(true);

  // ----------------------------- QUERIES

  const { data: apiData, isLoading: apiLoading } = useQuery({
    queryKey: ["projects", 1],
    queryFn: async () => getProjects("1"),
    enabled: payment,
    select: (res) => res.projects.map(fromAPI),
  });

  useEffect(() => {
    if (payment) return;
    if (!isReady) return;

    setIdbLoading(true);
    getAll()
      .then((data) => setIdbProjects(data.map(fromIDB)))
      .finally(() => setIdbLoading(false));
  }, [isReady, payment, refreshKey]);

  // ----------------------------- DERIVED STATE

  const projects: NormalizedProject[] = payment ? (apiData ?? []) : idbProjects;
  const isLoading = payment ? apiLoading : idbLoading;

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // ----------------------------- HANDLERS

  const handlePressStart = (item: NormalizedProject) => {
    pressTimer.current = setTimeout(() => {
      setIsSelectionMode(true);
      setActiveItem(null);
      setSelectedItems([item._raw]);
    }, 800);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleCheckboxChange = (item: NormalizedProject) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((s) => getUID(s) === item.uid);
      if (isSelected) {
        const newItems = prev.filter((s) => getUID(s) !== item.uid);
        if (newItems.length === 0) setIsSelectionMode(false);
        return newItems;
      } else {
        return [...prev, item._raw];
      }
    });
  };

  // ----------------------------- RENDER

  return (
    <div className="flex flex-col gap-1.5">
      {isLoading ? (
        <ListSkeleton count={5} />
      ) : projects.length === 0 || filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center gap-2 mt-10">
          <NoData />
        </div>
      ) : null}

      {filteredProjects.map((item, index) => {
        const isSelected = selectedItems.some((s) => getUID(s) === item.uid);

        return (
          <TemplateList
            key={item.uid}
            selectable
            isSelectionMode={isSelectionMode}
            isSelected={isSelected}
            onPressStart={() => handlePressStart(item)}
            onPressEnd={handlePressEnd}
            onCheckboxChange={() => handleCheckboxChange(item)}
            onClick={() => {
              handleSubmitMenu(item._raw);
              setActiveItem(item);
            }}
            showIcon
            icon={LuFolder}
            primaryText={item.name}
            item={{ ...item._raw, id: item.uid }}
            index={index}
            activeItem={
              activeItem ? { ...activeItem._raw, id: activeItem.uid } : null
            }
          />
        );
      })}
    </div>
  );
};

export default ProjectListDB;

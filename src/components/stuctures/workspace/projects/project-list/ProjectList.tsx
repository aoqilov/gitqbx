import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import { useTranslation } from "@/i18n/languageConfig";
import { getProjects } from "@/service/projects-route";
import { globalParams } from "@/utils/globalParams";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { LuFolder } from "react-icons/lu";

const ProjectList = ({
  searchValue,
  handleSubmitMenu,
  isSelectionMode,
  setIsSelectionMode,
  setSelectedItems,
  selectedItems,
}: {
  searchValue: string;
  handleSubmitMenu: (item: Project) => void;
  isSelectionMode: boolean;
  setIsSelectionMode: (value: boolean) => void;
  setSelectedItems: React.Dispatch<React.SetStateAction<Project[]>>;
  selectedItems: Project[];
}) => {
  // --------------------------------------   HOOKS
  //
  //
  const { t } = useTranslation("workspace.pages.projectsws.");
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const { workspaceID } = globalParams();

  // --------------------------------------   STATE
  //
  //
  const [activeItem, setActiveItem] = useState<Project | null>(null);

  // --------------------------------------  QUERIES
  const resProjects = useQuery({
    queryKey: ["projects", workspaceID],
    queryFn: async () => getProjects(workspaceID!),
  });

  const projects = resProjects?.data?.projects || [];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // --------------------------------------   FUNCTIONS

  //
  //
  const handlePressStart = (item: Project) => {
    pressTimer.current = setTimeout(() => {
      setIsSelectionMode(true);
      setActiveItem(null);
      setSelectedItems([item]);
    }, 800);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleCheckboxChange = (item: Project) => {
    setSelectedItems((prev: Project[]) => {
      const isSelected = prev.some((selected) => selected.id === item.id);

      if (isSelected) {
        const newItems = prev.filter((selected) => selected.id !== item.id);

        // Agar hech qanday item qolmasa, selection mode'ni o'chiramiz
        if (newItems.length === 0) {
          setIsSelectionMode(false);
        }

        return newItems;
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <div className=" flex flex-col gap-1.5">
      {resProjects.isLoading ? (
        <ListSkeleton count={5} />
      ) : projects.length === 0 || filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center gap-2 mt-10">
          <NoData />
        </div>
      ) : null}
      {filteredProjects.length > 0 &&
        filteredProjects.map((item, index) => (
          <TemplateList
            key={item.id}
            selectable // Bu flag checkbox ni yoqadi
            isSelectionMode={isSelectionMode}
            isSelected={selectedItems.some((s) => s.id === item.id)}
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
            onCheckboxChange={handleCheckboxChange}
            onClick={(item) => {
              handleSubmitMenu(item);
              setActiveItem(item);
            }}
            showIcon
            icon={LuFolder}
            primaryText={item.name}
            rightText={item.members.length + t("participants")}
            item={item}
            index={index}
            activeItem={activeItem}
          />
        ))}
    </div>
  );
};

export default ProjectList;

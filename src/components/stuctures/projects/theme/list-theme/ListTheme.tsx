import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import { iconList } from "@/constants/iconList";
import { RootState } from "@/store";
import { globalParams } from "@/utils/globalParams";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";

const iconPacks = { ...FaIcons, ...MdIcons, ...AiIcons };

const ListTheme = ({
  searchValue = "",
  isSelectionMode,
  setIsSelectionMode,
  selectedItems,
  setSelectedItems,
}: {
  searchValue?: string;
  isSelectionMode: boolean;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: ProjectTheme[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ProjectTheme[]>>;
}) => {
  // --------------------------------------   HOOKS
  //
  //

  const { projectID } = globalParams();
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const resProjectThemes = useSelector(
    (state: RootState) =>
      state.projectThemes.byProjectId[Number(projectID)] ?? [],
  );

  const filteredThemes = resProjectThemes.filter((theme) =>
    theme.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // --------------------------------------   STATE
  //
  //
  const handlePressStart = (item: ProjectTheme) => {
    pressTimer.current = setTimeout(() => {
      setIsSelectionMode(true);
      setSelectedItems([item]);
    }, 800);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleCheckboxChange = (item: ProjectTheme) => {
    setSelectedItems((prev) => {
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
  //   --------------------------------------   FUNCTIONS
  function getIconComponentById(id: number) {
    if (id == null || !iconList.length) return null;
    const entry =
      iconList.find((i) => i.index === id) ??
      iconList[Math.abs(id) % iconList.length];
    if (!entry) return null;
    return iconPacks[entry.icon as keyof typeof iconPacks] ?? null;
  }
  return (
    <div className="flex flex-col gap-1.5">
      {filteredThemes.length === 0 ? (
        <NoData />
      ) : (
        filteredThemes.map((item, index) => (
          <TemplateList
            key={item.id}
            selectable
            isSelectionMode={isSelectionMode}
            isSelected={selectedItems.some((s) => s.id === item.id)}
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
            onCheckboxChange={handleCheckboxChange}
            onClick={(item) => console.log("Clicked:", item)}
            showIcon
            icon={getIconComponentById(item?.icon)}
            primaryText={item.name}
            item={item}
            index={index}
          />
        ))
      )}
    </div>
  );
};

export default ListTheme;

import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import Text from "@/components/ui/typography/Text";
import { RootState } from "@/store";
import { globalParams } from "@/utils/globalParams";
import React, { useRef, useState } from "react";
import { FaMask } from "react-icons/fa";
import { useSelector } from "react-redux";

const ListProjectsRole = ({
  searchValue,
  isSelectionMode,
  setIsSelectionMode,
  selectedItems,
  setSelectedItems,
}: {
  searchValue: string;
  isSelectionMode: boolean;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: ProjectRole[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ProjectRole[]>>;
}) => {
  // --------------------------------------   HOOKS
  //
  //
  const { projectID } = globalParams();

  const projectRoles = useSelector(
    (state: RootState) =>
      state.projectRoles.byProjectId[Number(projectID) ?? 0] ?? [],
  );
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  // --------------------------------------   STATE
  //
  //

  const [activeItem, setActiveItem] = useState<ProjectRole | null>(null);

  // --------------------------------------   FUNCTIONS

  //
  //
  const handlePressStart = (item: ProjectRole) => {
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

  const handleCheckboxChange = (item: ProjectRole) => {
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

  // Filter users based on search value
  const filteredRoles = projectRoles.filter((role) =>
    role.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <div className=" flex flex-col gap-1.5">
      {filteredRoles.length === 0 ? (
        <NoData />
      ) : (
        filteredRoles.map((item, index) => (
          <TemplateList
            key={item.id}
            selectable // Bu flag checkbox ni yoqadi
            isSelectionMode={isSelectionMode}
            isSelected={selectedItems.some((s) => s.id === item.id)}
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
            onCheckboxChange={handleCheckboxChange}
            onClick={(item) => setActiveItem(item)}
            showIcon
            icon={FaMask}
            primaryText={item.name}
            item={item}
            index={index}
          />
        ))
      )}
    </div>
  );
};

export default ListProjectsRole;

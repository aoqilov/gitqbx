import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import { useGetStoreDataByProjectId } from "@/hooks/use-store-data";
import { useTranslation } from "@/i18n/languageConfig";
import { RootState } from "@/store";
import { globalParams } from "@/utils/globalParams";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const ListProjectMembers = () => {
  // --------------------------------------   HOOKS
  //
  //
  const { t } = useTranslation("workspace.pages.projectMembers.");
  const { projectID } = globalParams();
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const { members } = useGetStoreDataByProjectId(+projectID!);
  const membersList = useSelector((state: RootState) => state.members.list);
  console.log("projectMembers", members);

  // --------------------------------------   STATE
  //
  //
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ProjectMember[]>([]);
  const [activeItem, setActiveItem] = useState<ProjectMember | null>(null);

  // --------------------------------------   FUNCTIONS
  //

  const handlePressStart = (item: ProjectMember) => {
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

  const handleCheckboxChange = (item: ProjectMember) => {
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

  // Filter invites based on search value
  return (
    <div className=" flex flex-col gap-1.5">
      {membersList.length === 0 ? (
        <NoData />
      ) : (
        membersList.map((item, index) => (
          <TemplateList
            key={item.id}
            selectable // Bu flag checkbox ni yoqadi
            isSelectionMode={isSelectionMode}
            isSelected={selectedItems.some((s) => s.id === item.id)}
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
            onCheckboxChange={handleCheckboxChange}
            onClick={(item) => setActiveItem(item)}
            showAvatar
            avatarSrc={item.id.toString()} // Bu yerda avatar uchun src ni berish kerak
            primaryText={item.id.toString()} // Bu yerda asosiy text ni berish kerak, masalan user name
            rightText={item.role.toString()} // Bu yerda ro'lni ko'rsatish mumkin
            item={item}
            index={index}
            // activeItem={activeItem}
          />
        ))
      )}
    </div>
  );
};

export default ListProjectMembers;

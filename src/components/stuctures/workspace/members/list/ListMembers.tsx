import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import { useGetStoreDataByWorkspaceId } from "@/hooks/use-store-data";
import { useTranslation } from "@/i18n/languageConfig";
import { globalParams } from "@/utils/globalParams";
import React, { useRef } from "react";

const ListMembers = ({
  searchValue,
  setIsSelectionMode,
  setSelectedItems,
  isSelectionMode,
  selectedItems,
  setActiveItem,
}: {
  searchValue: string;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Member[]>>;
  isSelectionMode: boolean;
  selectedItems: Member[];
  setActiveItem: React.Dispatch<React.SetStateAction<Member | null>>;
}) => {
  // --------------------------------  HOOKS
  const { t } = useTranslation("workspace.pages.membersws.");
  const { workspaceID } = globalParams();
  const { members, roles } = useGetStoreDataByWorkspaceId(+workspaceID!);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  // --------------------------------  QUERY
  // --------------------------------  STATE

  // --------------------------------  FUNCTIONS

  const handlePressStart = (item: any) => {
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

  const handleCheckboxChange = (item: any) => {
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

  const filteredMembers = members.filter((member) => {
    const fullName = member.userData.fullname
      ? member.userData.fullname.toLowerCase()
      : `${member.userData.first_name} ${member.userData.last_name}`.toLowerCase();
    return fullName.includes(searchValue.toLowerCase());
  });
  return (
    <div className=" flex flex-col gap-1.5">
      {filteredMembers.length === 0 ? (
        <div className="min-h-[calc(100vh-300px)]! flex items-center">
          <NoData />
        </div>
      ) : (
        filteredMembers.map((item: Member, index) => (
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
            avatarSrc={item.userData.telegram_avatar}
            primaryText={
              item.userData.fullname
                ? item.userData.fullname
                : item.userData.first_name + " " + item.userData.last_name
            }
            rightText={roles.find((r) => r.id === item.role)?.name || "-"}
            item={item}
            index={index}
            // activeItem={activeItem}
          />
        ))
      )}
    </div>
  );
};

export default ListMembers;

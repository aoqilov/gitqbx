import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import { useActions } from "@/hooks/use-actions/useActions";
import { RootState } from "@/store";
import { globalParams } from "@/utils/globalParams";
import React, { useRef } from "react";
import { HiHashtag } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const ListTagsGroup = ({
  searchValue = "",
  isSelectionMode,
  setIsSelectionMode,
  selectedItems,
  setSelectedItems,
}: {
  searchValue?: string;
  isSelectionMode: boolean;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: ProjectTagGroup[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ProjectTagGroup[]>>;
}) => {
  // --------------------------------------   HOOKS
  //
  //
  const navigate = useNavigate();
  const { projectID, workspaceID } = globalParams();
  const { setProjectNameForHeader2, setProjectTags } = useActions();
  const resTagsGroup = useSelector(
    (state: RootState) =>
      state.projectTags.byProjectTagsGroupId[Number(projectID) ?? 0] ?? [],
  );

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  // --------------------------------------   QUERYS

  // --------------------------------------   STATE
  //
  //

  // --------------------------------------   FUNCTIONS

  //
  //
  const filteredTagsGroup = resTagsGroup?.filter((group) =>
    group.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handlePressStart = (item: ProjectTagGroup) => {
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

  const handleCheckboxChange = (item: ProjectTagGroup) => {
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

  return (
    <div className="flex flex-col gap-1.5">
      {filteredTagsGroup?.length === 0 ? (
        <div className="flex flex-col items-center gap-2 mt-10">
          <NoData />
        </div>
      ) : (
        filteredTagsGroup?.map((item, index) => (
          <TemplateList
            key={item.id}
            selectable
            isSelectionMode={isSelectionMode}
            isSelected={selectedItems.some((s) => s.id === item.id)}
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
            onCheckboxChange={handleCheckboxChange}
            onClick={(item) => {
              setProjectNameForHeader2(item.name);
              setProjectTags({
                projectId: Number(projectID),
                tags: item.tags,
              });
              navigate(
                `/workspace/${workspaceID}/projects/${projectID}/tags-group/${item.id}`,
              );
            }}
          showIcon
            icon={HiHashtag}
            primaryText={item.name}
            item={item}
            index={index}
          />
        ))
      )}
    </div>
  );
};

export default ListTagsGroup;

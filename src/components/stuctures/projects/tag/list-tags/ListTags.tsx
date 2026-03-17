import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import Text from "@/components/ui/typography/Text";
import { RootState } from "@/store";
import { Span } from "@chakra-ui/react";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { globalParams } from "@/utils/globalParams";

const ListTags = ({
  searchValue = "",
  setIsSelectionMode,
  isSelectionMode,
  selectedItems,
  setSelectedItems,
}: {
  searchValue?: string;
  isSelectionMode: boolean;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: ProjectTag[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ProjectTag[]>>;
}) => {
  // --------------------------------------   HOOKS
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const { tagGroupID } = globalParams();
  console.log("tagGroupID:", tagGroupID);

  const listTags = useSelector(
    (state: RootState) =>
      state.projectTags.byProjectTagId[Number(tagGroupID)] ?? [],
  );

  const filteredTags = listTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // --------------------------------------   FUNCTIONS
  const handlePressStart = (item: ProjectTag) => {
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

  const handleCheckboxChange = (item: ProjectTag) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.id === item.id);
      if (isSelected) {
        const newItems = prev.filter((selected) => selected.id !== item.id);
        if (newItems.length === 0) setIsSelectionMode(false);
        return newItems;
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      {filteredTags.length === 0 && (
        <div className="flex flex-col items-center gap-2 mt-10">
          <NoData />
        </div>
      )}
      {filteredTags.map((item, index) => (
        <TemplateList
          key={item.id}
          selectable
          isSelectionMode={isSelectionMode}
          isSelected={selectedItems.some((s) => s.id === item.id)}
          onPressStart={handlePressStart}
          onPressEnd={handlePressEnd}
          onCheckboxChange={handleCheckboxChange}
          onClick={(item) => console.log("Clicked:", item)}
          renderLeft={() => (
            <div className="flex place-items-center gap-1">
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: item.color || "#000",
                  marginRight: "6px",
                }}
              />
              <Span>{index + 1}.</Span>
              <Text className="ml-2">{item.name}</Text>
            </div>
          )}
          primaryText={item.name}
          item={item}
          index={index}
        />
      ))}
    </div>
  );
};

export default ListTags;

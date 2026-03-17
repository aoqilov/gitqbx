import React from "react";

import TemplateList from "@/components/shared/template-list/TemplateList";

import { useRef } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import Text from "@/components/ui/typography/Text";
import { Icon, Span } from "@chakra-ui/react";
import { GrPin } from "react-icons/gr";
import NoData from "@/components/ui/no-data/NoData";
import { globalParams } from "@/utils/globalParams";

const ListStatus = ({
  isSortableActive,
  isSelectionMode,
  selectedItems,
  setIsSelectionMode,
  setSelectedItems,
  searchValue,
}: {
  isSortableActive?: boolean;
  isSelectionMode: boolean;
  selectedItems: ProjectStatus[];
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<ProjectStatus[]>>;
  searchValue?: string;
}) => {
  // ------------------------------   HOOKS
  const { projectID } = globalParams();
  const dataStatus = useSelector(
    (state: RootState) =>
      state.projectStatuses.byProjectId[Number(projectID) ?? 0] ?? [],
  );
  console.log("dataStatus", dataStatus);

  const filtered = searchValue
    ? dataStatus.filter((s) =>
        s.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : dataStatus;
  console.log("filtered", filtered);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  //
  //
  // -------------------------------   STATE
  //
  //
  // -------------------------------  FUNCTIONS
  const handlePressStart = (item: ProjectStatus) => {
    if (isSortableActive) return;

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

  const handleCheckboxChange = (item: ProjectStatus) => {
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
    <>
      <div className="flex flex-col gap-1.5">
        {filtered.length === 0 && <NoData />}
        {filtered.length > 0 &&
          filtered.map((item, index) => (
            <TemplateList<ProjectStatus>
              key={item.id}
              selectable // Bu flag checkbox ni yoqadi
              isSelectionMode={isSelectionMode}
              isSelected={selectedItems.some((s) => s.id === item.id)}
              onPressStart={() => handlePressStart(item)}
              onPressEnd={handlePressEnd}
              onCheckboxChange={handleCheckboxChange}
              primaryText={""}
              onClick={() => {}}
              renderLeft={() => {
                return (
                  <div className="flex place-items-center gap-1">
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: item.color || "#999",
                        marginRight: "6px",
                      }}
                    />
                    <Text className="ml-2">{item.name}</Text>
                  </div>
                );
              }}
              renderRight={() => {
                return (
                  <div>
                    {item.priority > 200 && (
                      <Icon as={GrPin} color="brand.500" fontSize="16px" />
                    )}
                  </div>
                );
              }}
              item={item}
              index={index}
            />
          ))}
      </div>
    </>
  );
};

export default ListStatus;

import TemplateFilter from "@/components/shared/template-filter/TemplateFilter";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import TemplateList from "@/components/shared/template-list/TemplateList";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { FC, useRef, useState } from "react";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ModalProjectRoutineAddEdit } from "@/components/stuctures/projects/routine/modals/ModalProjectRoutineAddEdit";
import { ModalProjectRoutineDelete } from "@/components/stuctures/projects/routine/modals/ModalProjectRoutineDelete";
import { TbRefreshAlert } from "react-icons/tb";

export interface TypeListUser {
  key: string;
  id: string;
  name: string;
  frequencyLabel: string;
  frequencyType: "daily" | "weekdays" | "weekly" | "monthly" | "yearly";
  isActive: boolean;
}

export const routineTasksMock: TypeListUser[] = [
  {
    key: "routine-1",
    id: "1",
    name: "Рутинная задача",
    frequencyLabel: "каждый день",
    frequencyType: "daily",
    isActive: true,
  },
  {
    key: "routine-2",
    id: "2",
    name: "Рутинная задача доп.",
    frequencyLabel: "каждый пром. вр.",
    frequencyType: "weekdays",
    isActive: false,
  },
  {
    key: "routine-3",
    id: "3",
    name: "Рутинная задача доп.",
    frequencyLabel: "каждый пн. нед.",
    frequencyType: "weekly",
    isActive: false,
  },
  {
    key: "routine-4",
    id: "4",
    name: "Рутинная задача доп.",
    frequencyLabel: "каждый дн. мес.",
    frequencyType: "monthly",
    isActive: false,
  },
  {
    key: "routine-5",
    id: "5",
    name: "Рутинная задача доп.",
    frequencyLabel: "каждый дн. г.",
    frequencyType: "yearly",
    isActive: false,
  },
  {
    key: "routine-6",
    id: "6",
    name: "Рутинная задача доп.",
    frequencyLabel: "каждый пром. вр.",
    frequencyType: "weekdays",
    isActive: false,
  },
];

const ThemeView: FC = () => {
  // --------------------------------------   HOOKS
  //
  //
  const { projectNameForHeader } = useSelector(
    (state: RootState) => state.params,
  );
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  // --------------------------------------   STATE
  //
  //
  const [searchValue, setSearchValue] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<TypeListUser[]>([]);

  const [modeModal, setModeModal] = useState<"add" | "edit">("add");
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // --------------------------------------   FUNCTIONS
  function handleSubmitDelete() {
    setDeleteModal(true);
  }

  function handleSubmitAdd() {
    setModeModal("add");
    setOpenModal(true);
  }
  function handleSubmitEdit() {
    setModeModal("edit");
    setOpenModal(true);
  }
  //
  //
  const handlePressStart = (item: TypeListUser) => {
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

  const handleCheckboxChange = (item: TypeListUser) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.key === item.key);

      if (isSelected) {
        const newItems = prev.filter((selected) => selected.key !== item.key);

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
  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
  };

  // Filter users based on search value
  const filteredUsers = routineTasksMock.filter((item) => {
    const searchLower = searchValue.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="flex flex-col ">
        <div className="mt-5!">
          <TemplateHeader
            title="Рутинные задачи"
            subText={projectNameForHeader}
            showBack={true}
          />
        </div>
        <div className="mt-4!">
          <TemplateFilter
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search student..."
            // showFilter
            // onFilterClick={() => console.log("Filter clicked")}
          />
        </div>
        <ScrollArea
          size={"xs"}
          orientation="vertical"
          className="max-h-[calc(100vh-200px)]! w-full mt-4!"
          isShow={false}
        >
          <div className=" flex flex-col gap-1.5">
            {filteredUsers.map((item, index) => (
              <TemplateList
                key={item.key}
                selectable // Bu flag checkbox ni yoqadi
                isSelectionMode={isSelectionMode}
                isSelected={selectedItems.some((s) => s.key === item.key)}
                onPressStart={handlePressStart}
                onPressEnd={handlePressEnd}
                onCheckboxChange={handleCheckboxChange}
                onClick={(item) => console.log("Clicked:", item)}
                showIcon
                icon={TbRefreshAlert}
                primaryText={item.name}
                item={item}
                index={index}
                rightText={item.frequencyLabel}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      {/* ACTION BUTTONS */}
      <TemplateButtons
        isSelectionMode={isSelectionMode}
        selectedCount={selectedItems.length}
        onAdd={() => handleSubmitAdd()}
        onEdit={() => handleSubmitEdit()}
        onDelete={() => handleSubmitDelete()}
        onClear={() => cancelSelection()}
      />
      {/* MODALS */}

      <ModalProjectRoutineAddEdit
        open={openModal}
        close={() => setOpenModal(false)}
        initialData={selectedItems[0]}
        mode={modeModal}
        cancelSelection={cancelSelection}
      />
      <ModalProjectRoutineDelete<TypeListUser>
        open={deleteModal}
        close={() => setDeleteModal(false)}
        selectedItems={selectedItems} // Tanlangan loyihalar massivi
        cancelSelection={cancelSelection}
      />
    </>
  );
};

export default ThemeView;

import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import { RootState } from "@/store";
import { useRef } from "react";
import { IconType } from "react-icons";
import { FaMask } from "react-icons/fa";
import { useSelector } from "react-redux";

interface ListRoleWorkspaceProps {
  searchValue?: string;
  isSelectionMode: boolean;
  selectedItems: Role[];
  setIsSelectionMode: (value: boolean) => void;
  setSelectedItems: (items: Role[] | ((prev: Role[]) => Role[])) => void;
}

const ListRoleWorkspace = ({
  searchValue = "",
  isSelectionMode,
  selectedItems,
  setIsSelectionMode,
  setSelectedItems,
}: ListRoleWorkspaceProps) => {
  //
  const roles = useSelector((state: RootState) => state.roles.list);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  // --------------------------------------   FUNCTIONS
  const handlePressStart = (item: Role) => {
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

  const handleCheckboxChange = (item: Role) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.id === item.id);

      if (isSelected) {
        const newItems = prev.filter((selected) => selected.id !== item.id);
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
      {filteredRoles.length === 0 ? (
        <NoData />
      ) : (
        filteredRoles.map((item, index) => (
          <TemplateList
            key={item.id}
            selectable
            isSelectionMode={isSelectionMode}
            isSelected={selectedItems.some((s) => s.id == item.id)}
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
            onCheckboxChange={handleCheckboxChange}
            onClick={(item) => console.log("Clicked:", item)}
            showIcon
            icon={FaMask as IconType}
            primaryText={item.name}
            item={item}
            index={index}
          />
        ))
      )}
    </div>
  );
};

export default ListRoleWorkspace;

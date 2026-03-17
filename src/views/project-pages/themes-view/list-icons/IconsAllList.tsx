// IconGrid.tsx
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import { iconList } from "../../../../constants/iconList";

type IconType =
  | "work"
  | "document"
  | "date"
  | "status"
  | "user"
  | "security"
  | "finance"
  | "communication"
  | "infrastructure"
  | "analytics";

interface Props {
  filterType?: IconType;
  onSelect?: (iconName: string) => void;
  selectedIcon?: string;
}

const iconPacks = {
  ...FaIcons,
  ...MdIcons,
  ...AiIcons,
};

const IconsAllList = ({ filterType, onSelect, selectedIcon }: Props) => {
  const filteredIcons = filterType
    ? iconList.filter((i) => i.iconType === filterType)
    : iconList;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto auto auto auto auto",
        gap: "16px",
      }}
    >
      {filteredIcons.map((item) => {
        const IconComponent = iconPacks[item.icon as keyof typeof iconPacks];

        if (!IconComponent) return null;

        return (
          <div
            key={item.index}
            onClick={() => onSelect?.(item.icon)}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              justifyItems: "center",
              alignItems: "center",
              padding: "10px",
              border:
                selectedIcon === item.icon
                  ? "2px solid var(--main-color)"
                  : "1px solid var(--border-input)",
              borderRadius: "8px",
              cursor: "pointer",

              transition: "all 0.15s ease",
            }}
          >
            <IconComponent
              size={18}
              color={selectedIcon === item.icon ? "var(--main-color)" : "#777"}
            />
          </div>
        );
      })}
    </div>
  );
};

export default IconsAllList;

//  return (
//     <>
//       <IconsAllList
//         onSelect={(iconName) => console.log("Selected icon:", iconName)}
//       />
//     </>
//   );

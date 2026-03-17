import { ThemeForIndexedDB } from "@/components/stuctures/projects/theme/types";
import Text from "@/components/ui/typography/Text";
import { iconList } from "@/constants/iconList";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { RootState } from "@/store";
import { Icon, Skeleton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import { useSelector } from "react-redux";

// ─── Constants ────────────────────────────────────────────────────────────────
const iconPacks = { ...FaIcons, ...MdIcons, ...AiIcons };
const SKELETON_COUNT = 6;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getIconByIndex(index: number) {
  if (index == null) return null;
  const entry =
    iconList.find((i) => i.index === index) ??
    iconList[Math.abs(index) % iconList.length];
  if (!entry) return null;
  return iconPacks[entry.icon as keyof typeof iconPacks] ?? null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const CategorySkeleton = () => (
  <div className="flex flex-col items-center gap-2 h-[60px]">
    <Skeleton width="40px" height="40px" borderRadius="50%" />
    <Skeleton width="36px" height="10px" borderRadius="999px" />
  </div>
);

interface CategoryItemProps {
  cat: ThemeForIndexedDB;
  isActive: boolean;
  onClick: () => void;
}

const CategoryItem = ({ cat, isActive, onClick }: CategoryItemProps) => {
  const IconComponent = getIconByIndex(cat.icon);

  return (
    <div
      className="flex flex-col items-center  cursor-pointer "
      onClick={onClick}
    >
      <div
        className="flex items-center justify-center transition-all duration-200  w-10! h-10! rounded-full! "
        style={{
          backgroundColor: isActive
            ? "var(--main-color, #7C3AED)"
            : "var(--bg-theme-iconback)",
          // border: isActive ? "none" : "2px solid transparent",
        }}
      >
        {IconComponent && (
          <Icon
            as={IconComponent}
            fontSize={20}
            transition="color 0.2s"
            color={isActive ? "white" : "var(--text-lgray-dgreydark)"}
          />
        )}
      </div>

      <div className="mt-1! max-w-[80px]">
        <Text
          truncate
          className="text-[13px] font-medium transition-colors duration-200 whitespace-nowrap "
          style={{ color: isActive ? "var(--main-color, #7C3AED)" : "#9898A8" }}
        >
          {cat.name}
        </Text>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SelfTasksBar = ({
  selectProjectID,
  setSelectedThemeId,
}: {
  selectProjectID: number | null;
  setSelectedThemeId: (id: number | null) => void;
}) => {
  const projectID = selectProjectID;

  // ------------------------------------------- HOOKS
  const { getAll, isReady } = useIndexedDB<ThemeForIndexedDB>({
    dbName: "deviceDB",
    storeName: "theme",
  });
  const { payment } = useSelector((state: RootState) => state.params);

  // ------------------------------------------- STATE
  const [isLoading, setIsLoading] = useState(true);
  const [dbData, setDbData] = useState<ThemeForIndexedDB[]>([]);
  const [activeId, setActiveId] = useState<number | string | undefined>();

  // ------------------------------------------- EFFECTS
  useEffect(() => {
    if (!payment) return;
    setIsLoading(true);
    // TODO: API call
  }, [payment]);

  useEffect(() => {
    if (payment) return;
    if (!isReady) return;

    setIsLoading(true);
    getAll()
      .then((data) => {
        const filtered = data.filter((item) => item.project === projectID);
        setDbData(filtered);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [payment, isReady, getAll, projectID]);

  // ------------------------------------------- RENDER
  return (
    <div className="w-full! flex gap-7 overflow-x-auto items-center px-0.5!">
      {isLoading ? (
        Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))
      ) : dbData.length === 0 ? (
        <div className="h-[64px]! flex items-center">
          <Text className="text-nodata mt-2!">No categories found.</Text>
        </div>
      ) : (
        dbData.map((cat) => {
          const itemKey = payment ? cat.id : cat.local_id;

          return (
            <CategoryItem
              key={itemKey}
              cat={cat}
              isActive={activeId === itemKey}
              onClick={() => {
                if (activeId === itemKey) {
                  setActiveId(undefined);
                  setSelectedThemeId(null);
                } else {
                  setActiveId(itemKey as number);
                  setSelectedThemeId(cat.icon);
                }
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default SelfTasksBar;

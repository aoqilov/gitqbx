import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { iconList } from "@/constants/iconList";
import {
  ThemeForIndexedDB,
  NormalizedTheme,
  fromThemeIDB,
  fromThemeAPI,
} from "../types";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getThemes } from "@/service/themes-route";

const iconPacks = { ...FaIcons, ...MdIcons, ...AiIcons };

/** iconList.index raqami bo'yicha icon komponentini qaytaradi */
function getIconByIndex(index: number) {
  if (index == null) return null;
  const entry =
    iconList.find((i) => i.index === index) ??
    iconList[Math.abs(index) % iconList.length];
  if (!entry) return null;
  return iconPacks[entry.icon as keyof typeof iconPacks] ?? null;
}

const ListThemeDB = memo(function ListThemeDB({
  projectId,
  isSelectionMode,
  selectedItems,
  setIsSelectionMode,
  setSelectedItems,
  searchValue,
  refreshKey,
}: {
  projectId: number;
  isSelectionMode: boolean;
  selectedItems: (ThemeForIndexedDB | ProjectTheme)[];
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItems: React.Dispatch<
    React.SetStateAction<(ThemeForIndexedDB | ProjectTheme)[]>
  >;
  searchValue?: string;
  refreshKey?: number;
}) {
  // ------------------------------   HOOKS
  const { payment } = useSelector((state: RootState) => state.params);
  const { isReady, getAll } = useIndexedDB<ThemeForIndexedDB>({
    dbName: "deviceDB",
    storeName: "theme",
  });

  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------   STATE
  const [idbThemes, setIdbThemes] = useState<NormalizedTheme[]>([]);
  const [isIdbLoading, setIsIdbLoading] = useState(true);

  const prevDataRef = useRef<string>("");

  // -------------------------------   API SOURCE (payment=true)
  const { data: apiData, isLoading: apiLoading } = useQuery({
    queryKey: ["themes", projectId],
    queryFn: () => getThemes({ projectID: projectId }),
    enabled: payment,
    select: (data) => (data?.themes ?? []).map(fromThemeAPI),
  });

  // -------------------------------   IDB SOURCE (payment=false)
  useEffect(() => {
    if (payment) return;
    if (!isReady) return;

    const isFirstLoad = prevDataRef.current === "";
    if (isFirstLoad) setIsIdbLoading(true);

    getAll()
      .then((data) => {
        const filtered = data
          .filter((t) => t.project === projectId)
          .sort((a, b) => a.createdAt - b.createdAt);

        const serialized = JSON.stringify(filtered);
        if (serialized === prevDataRef.current) return;
        prevDataRef.current = serialized;
        setIdbThemes(filtered.map(fromThemeIDB));
      })
      .finally(() => {
        if (isFirstLoad) setIsIdbLoading(false);
      });
  }, [isReady, getAll, refreshKey, projectId, payment]);

  // -------------------------------   UNIFIED SOURCE
  const themes: NormalizedTheme[] = payment ? (apiData ?? []) : idbThemes;
  const isLoading = payment ? apiLoading : isIdbLoading;

  // Search filter — memoized
  const filtered = useMemo(
    () =>
      searchValue
        ? themes.filter((t) =>
            t.name.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : themes,
    [themes, searchValue],
  );

  // -------------------------------  FUNCTIONS — memoized
  const handlePressStart = useCallback(
    (item: NormalizedTheme) => {
      pressTimer.current = setTimeout(() => {
        setIsSelectionMode(true);
        setSelectedItems([item._raw]);
      }, 800);
    },
    [setIsSelectionMode, setSelectedItems],
  );

  const handlePressEnd = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handleCheckboxChange = useCallback(
    (item: NormalizedTheme) => {
      setSelectedItems((prev) => {
        const isSelected = prev.some((s) => {
          const sUid = "local_id" in s ? s.local_id : s.id;
          return sUid === item.uid;
        });
        if (isSelected) {
          const newItems = prev.filter((s) => {
            const sUid = "local_id" in s ? s.local_id : s.id;
            return sUid !== item.uid;
          });
          if (newItems.length === 0) setIsSelectionMode(false);
          return newItems;
        } else {
          return [...prev, item._raw];
        }
      });
    },
    [setIsSelectionMode, setSelectedItems],
  );

  return (
    <>
      {isLoading && <ListSkeleton count={4} />}

      {!isLoading && (
        <div className="flex flex-col gap-1.5">
          {filtered.length === 0 && <NoData />}
          {filtered.map((item, index) => {
            const templateItem = { ...item._raw, id: item.uid };

            return (
              <TemplateList<typeof templateItem>
                key={item.uid}
                selectable
                isSelectionMode={isSelectionMode}
                isSelected={selectedItems.some((s) => {
                  const sUid = "local_id" in s ? s.local_id : s.id;
                  return sUid === item.uid;
                })}
                onPressStart={() => handlePressStart(item)}
                onPressEnd={handlePressEnd}
                onCheckboxChange={() => handleCheckboxChange(item)}
                onClick={() => console.log("Theme clicked:", item)}
                showIcon
                icon={getIconByIndex(item.icon)}
                primaryText={item.name}
                item={templateItem}
                index={index}
              />
            );
          })}
        </div>
      )}
    </>
  );
});

export default ListThemeDB;

import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import {
  TagGroupForIndexedDB,
  NormalizedTagGroup,
  fromTagGroupIDB,
  fromTagGroupAPI,
} from "../types";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiHashtag } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { globalParams } from "@/utils/globalParams";
import { useActions } from "@/hooks/use-actions/useActions";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getTagsGroupByProjectID } from "@/service/tags-group-route";

const ListTagsGroupDB = memo(function ListTagsGroupDB({
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
  selectedItems: (TagGroupForIndexedDB | ProjectTagGroup)[];
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItems: React.Dispatch<
    React.SetStateAction<(TagGroupForIndexedDB | ProjectTagGroup)[]>
  >;
  searchValue?: string;
  refreshKey?: number;
}) {
  // ------------------------------   HOOKS
  const { payment } = useSelector((state: RootState) => state.params);
  const { isReady, getAll } = useIndexedDB<TagGroupForIndexedDB>({
    dbName: "deviceDB",
    storeName: "tagGroup",
  });
  const navigate = useNavigate();
  const { setProjectNameForHeader2 } = useActions();
  const { workspaceID, projectID } = globalParams();

  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------   STATE
  const [idbTagGroups, setIdbTagGroups] = useState<NormalizedTagGroup[]>([]);
  const [isIdbLoading, setIsIdbLoading] = useState(true);

  const prevDataRef = useRef<string>("");

  // -------------------------------   API SOURCE (payment=true)
  const { data: apiData, isLoading: apiLoading } = useQuery({
    queryKey: ["tagGroups", projectId],
    queryFn: () => getTagsGroupByProjectID(String(projectId)),
    enabled: payment,
    select: (data) => (data ?? []).map(fromTagGroupAPI),
  });

  // -------------------------------   IDB SOURCE (payment=false)
  useEffect(() => {
    if (payment) return; // API ishlatilayapti
    if (!isReady) return;

    const isFirstLoad = prevDataRef.current === "";
    if (isFirstLoad) setIsIdbLoading(true);

    getAll()
      .then((data) => {
        const filtered = data.filter((g) => g.project === projectId);
        const serialized = JSON.stringify(filtered);
        if (serialized === prevDataRef.current) return;
        prevDataRef.current = serialized;
        setIdbTagGroups(filtered.map(fromTagGroupIDB));
      })
      .finally(() => {
        if (isFirstLoad) setIsIdbLoading(false);
      });
  }, [isReady, getAll, refreshKey, projectId, payment]);

  // -------------------------------   UNIFIED SOURCE
  const tagGroups: NormalizedTagGroup[] = payment
    ? (apiData ?? [])
    : idbTagGroups;
  const isLoading = payment ? apiLoading : isIdbLoading;

  // Search filter — memoized
  const filtered = useMemo(
    () =>
      searchValue
        ? tagGroups.filter((g) =>
            g.name.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : tagGroups,
    [tagGroups, searchValue],
  );

  // -------------------------------  FUNCTIONS — memoized
  const handlePressStart = useCallback(
    (item: NormalizedTagGroup) => {
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
    (item: NormalizedTagGroup) => {
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
                primaryText={item.name}
                onClick={() => {
                  setProjectNameForHeader2(item.name);
                  navigate(
                    `/workspace/${workspaceID}/projects/${projectID}/tags-group/${item.uid}/`,
                  );
                }}
                showIcon
                icon={HiHashtag}
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

export default ListTagsGroupDB;

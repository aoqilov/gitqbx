import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import {
  TagForIndexedDB,
  NormalizedTag,
  fromTagIDB,
  fromTagAPI,
} from "../types";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Span } from "@chakra-ui/react";
import Text from "@/components/ui/typography/Text";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { globalParams } from "@/utils/globalParams";

// API service — taglar projectID + tagGroupID bo'yicha
async function getTagsByGroup(projectID: string, tagGroupID: string) {
  const { api } = await import("@/plugin/axios/axios");
  const res = await api.get<{ tags: ProjectTag[] }>(
    `/projects/${projectID}/tagGroups/${tagGroupID}/tags`,
  );
  return res.data?.tags ?? (res.data as unknown as ProjectTag[]) ?? [];
}

const ListTagsDB = memo(function ListTagsDB({
  projectId,
  tagGroupId,
  isSelectionMode,
  selectedItems,
  setIsSelectionMode,
  setSelectedItems,
  searchValue,
  refreshKey,
}: {
  projectId: number;
  tagGroupId: number;
  isSelectionMode: boolean;
  selectedItems: (TagForIndexedDB | ProjectTag)[];
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItems: React.Dispatch<
    React.SetStateAction<(TagForIndexedDB | ProjectTag)[]>
  >;
  searchValue?: string;
  refreshKey?: number;
}) {
  // ------------------------------   HOOKS
  const { payment } = useSelector((state: RootState) => state.params);
  const { isReady, getAll } = useIndexedDB<TagForIndexedDB>({
    dbName: "deviceDB",
    storeName: "tags",
  });
  const { projectID, tagGroupID } = globalParams();

  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------   STATE
  const [idbTags, setIdbTags] = useState<NormalizedTag[]>([]);
  const [isIdbLoading, setIsIdbLoading] = useState(true);

  const prevDataRef = useRef<string>("");

  // -------------------------------   API SOURCE (payment=true)
  const { data: apiData, isLoading: apiLoading } = useQuery({
    queryKey: ["tags", projectId, tagGroupId],
    queryFn: () => getTagsByGroup(String(projectID), String(tagGroupID)),
    enabled: payment,
    select: (data) =>
      [...data]
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
        .map(fromTagAPI),
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
          .filter((t) => t.project === projectId && t.tag_group === tagGroupId)
          .sort((a, b) => a.priority - b.priority);

        const serialized = JSON.stringify(filtered);
        if (serialized === prevDataRef.current) return;
        prevDataRef.current = serialized;
        setIdbTags(filtered.map(fromTagIDB));
      })
      .finally(() => {
        if (isFirstLoad) setIsIdbLoading(false);
      });
  }, [isReady, getAll, refreshKey, projectId, tagGroupId, payment]);

  // -------------------------------   UNIFIED SOURCE
  const tags: NormalizedTag[] = payment ? (apiData ?? []) : idbTags;
  const isLoading = payment ? apiLoading : isIdbLoading;

  // Search filter — memoized
  const filtered = useMemo(
    () =>
      searchValue
        ? tags.filter((t) =>
            t.name.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : tags,
    [tags, searchValue],
  );

  // -------------------------------  FUNCTIONS — memoized
  const handlePressStart = useCallback(
    (item: NormalizedTag) => {
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
    (item: NormalizedTag) => {
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
                onClick={() => console.log("Tag clicked:", item)}
                renderLeft={() => (
                  <div className="flex place-items-center gap-1">
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: item.color || "#999",
                        marginRight: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <Span>{index + 1}.</Span>
                    <Text className="ml-2">{item.name}</Text>
                  </div>
                )}
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

export default ListTagsDB;

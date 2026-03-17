import TemplateList from "@/components/shared/template-list/TemplateList";
import NoData from "@/components/ui/no-data/NoData";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import {
  StatusForIndexedDB,
  NormalizedStatus,
  fromStatusIDB,
  fromStatusAPI,
  getStatusUID,
} from "../types";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@chakra-ui/react";
import Text from "@/components/ui/typography/Text";
import { GrPin } from "react-icons/gr";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getProjectStatuses } from "@/service/status-route";

const ListStatusDB = ({
  projectId,
  isSortableActive,
  isSelectionMode,
  selectedItems,
  setIsSelectionMode,
  setSelectedItems,
  searchValue,
  refreshKey,
}: {
  projectId: number;
  isSortableActive?: boolean;
  isSelectionMode: boolean;
  selectedItems: (StatusForIndexedDB | ProjectStatus)[];
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItems: React.Dispatch<
    React.SetStateAction<(StatusForIndexedDB | ProjectStatus)[]>
  >;
  searchValue?: string;
  refreshKey?: number;
}) => {
  const { payment } = useSelector((state: RootState) => state.params);

  // ------------------------------   IDB HOOKS
  const { isReady, getAll } = useIndexedDB<StatusForIndexedDB>({
    dbName: "deviceDB",
    storeName: "statuses",
  });

  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------   STATE
  const [idbStatuses, setIdbStatuses] = useState<NormalizedStatus[]>([]);
  const [idbLoading, setIdbLoading] = useState(true);

  // -------------------------------   API QUERY
  const { data: apiData, isLoading: apiLoading } = useQuery({
    queryKey: ["statuses", projectId],
    queryFn: () => getProjectStatuses({ projectID: String(projectId) }),
    enabled: payment,
    select: (data) => data.map(fromStatusAPI),
  });

  // -------------------------------   IDB DATA FETCH
  useEffect(() => {
    if (payment) return;
    if (!isReady) return;
    setIdbLoading(true);
    getAll()
      .then((data) => {
        const filtered = data
          .filter((s) => s.project === projectId)
          .sort((a, b) => a.priority - b.priority)
          .map(fromStatusIDB);
        setIdbStatuses(filtered);
      })
      .finally(() => setIdbLoading(false));
  }, [isReady, getAll, refreshKey, projectId, payment]);

  // -------------------------------   DERIVED STATE
  const statuses: NormalizedStatus[] = payment ? (apiData ?? []) : idbStatuses;
  const isLoading = payment ? apiLoading : idbLoading;

  const filtered = searchValue
    ? statuses.filter((s) =>
        s.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : statuses;

  const handlePressStart = (item: NormalizedStatus) => {
    if (isSortableActive) return;
    pressTimer.current = setTimeout(() => {
      setIsSelectionMode(true);
      setSelectedItems([item._raw]);
    }, 800);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleCheckboxChange = (item: NormalizedStatus) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((s) => getStatusUID(s) === item.uid);
      if (isSelected) {
        const newItems = prev.filter((s) => getStatusUID(s) !== item.uid);
        if (newItems.length === 0) setIsSelectionMode(false);
        return newItems;
      } else {
        return [...prev, item._raw];
      }
    });
  };

  return (
    <>
      {isLoading && <ListSkeleton count={5} />}
      {!isLoading && (
        <div className="flex flex-col gap-1.5">
          {filtered.length === 0 && <NoData />}
          {filtered.map((item, index) => (
            <TemplateList
              key={item.uid}
              selectable
              isSelectionMode={isSelectionMode}
              isSelected={selectedItems.some(
                (s) => getStatusUID(s) === item.uid,
              )}
              onPressStart={() => handlePressStart(item)}
              onPressEnd={handlePressEnd}
              onCheckboxChange={() => handleCheckboxChange(item)}
              primaryText={""}
              onClick={() => {}}
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
                  <Text className="ml-2">{item.name}</Text>
                </div>
              )}
              renderRight={() => (
                <div>
                  {item.priority >= 200 && (
                    <Icon as={GrPin} color="brand.500" fontSize="16px" />
                  )}
                </div>
              )}
              item={{ ...item._raw, id: item.uid }}
              index={index}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ListStatusDB;

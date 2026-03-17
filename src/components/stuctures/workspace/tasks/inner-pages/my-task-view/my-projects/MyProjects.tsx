import Text from "@/components/ui/typography/Text";
import { Skeleton } from "@chakra-ui/react";

import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { ProjectForIndexedDB } from "@/components/stuctures/workspace/projects/types";

const MyProjects = ({
  handleGetProjectItem,
}: {
  handleGetProjectItem: (projectID: number) => void;
}) => {
  // ------------------------------------------ HOOKS
  const { payment } = useSelector((state: RootState) => state.params);

  const { getAll, isReady } = useIndexedDB<ProjectForIndexedDB>({
    dbName: "deviceDB",
    storeName: "projects",
  });
  const items = [120, 90, 140, 100, 110]; // har bir pill kengligi (px)

  // ------------------------------------------- STATE
  const [isLoading, setIsLoading] = useState(true);
  const [dbData, setDbData] = useState<ProjectForIndexedDB[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  // ------------------------------------------ EFFECTS
  useEffect(() => {
    if (payment) return;
    if (!isReady) return;

    setIsLoading(true);
    getAll()
      .then((data) => {
        setDbData(data);
        // 1-chi element default active
        if (data.length > 0) {
          const firstId = data[0].local_id;
          setActiveId(firstId);
          handleGetProjectItem(firstId);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [payment, isReady, getAll]);

  // ------------------------------------------ RENDER
  return (
    <div className="h-[28px]! w-full! flex items-center bg-var(--bg-main)!">
      {/* <div
        className="h-7! px-1! rounded-full flex items-center justify-center border! border-(--border-input)! cursor-pointer"
        onClick={() => console.log("filter")}
      >
        <Icon as={RiFilter2Fill} color="var(--border-input)" fontSize={20} />
      </div> */}

      <div className="flex gap-1.25!  overflow-x-auto">
        {isLoading ? (
          <div className="flex gap-1.25!">
            {items.map((width, i) => (
              <Skeleton
                key={i}
                className="h-[28px]! rounded-[30px]! animate-pulse"
                style={{
                  width,
                  opacity: 0.25,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
        ) : (
          dbData.map((project) => {
            // payment true → id, false → local_id
            const itemKey = payment ? project.id : project.local_id;
            const isActive = activeId === itemKey;

            return (
              <div
                key={itemKey}
                onClick={() => {
                  setActiveId(itemKey as number);
                  handleGetProjectItem(itemKey as number);
                }}
                className="px-6! h-[28px]! rounded-[30px]! border! flex items-center justify-center cursor-pointer transition-all"
                style={
                  isActive
                    ? { background: "#711CE9", borderColor: "transparent" }
                    : { borderColor: "#711CE9" }
                }
              >
                <Text
                  color={isActive ? "white" : "#7A3FF2"}
                  fontSize="1em"
                  fontWeight="500"
                  lineHeight="10px"
                  whiteSpace="nowrap"
                >
                  {project.name}
                </Text>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyProjects;

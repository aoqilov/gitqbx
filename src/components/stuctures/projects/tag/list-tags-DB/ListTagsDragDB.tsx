import { useState, useRef, useEffect } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Text from "@/components/ui/typography/Text";
import NoData from "@/components/ui/no-data/NoData";
import ListSkeleton from "@/components/ui/skeltion/ListSkeleton";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { TagForIndexedDB } from "../types";

interface PriorityChange {
  id: number;
  priority: number;
}

interface CardProps {
  item: TagForIndexedDB;
  activeIndex: number;
}

const Card = ({ item, activeIndex }: CardProps) => {
  const id = String(item.local_id);

  const {
    listeners,
    attributes,
    setNodeRef,
    transition,
    transform,
    active,
    index,
    over,
  } = useSortable({ id });

  const isActive = active?.id === id;
  const insertPosition =
    over?.id === id ? (index > activeIndex ? 1 : -1) : undefined;

  const style: React.CSSProperties = {
    transition,
    padding: 12,
    backgroundColor: "#fff",
    border: "1px solid #e1e1e1",
    borderRadius: 8,
    position: "relative",
    transform: CSS.Transform.toString(transform),
    opacity: isActive ? 0.5 : 1,
    touchAction: "none",
    cursor: "grab",
  };

  return (
    <>
      {insertPosition === -1 && (
        <div
          style={{
            height: 4,
            backgroundColor: "var(--main-color)",
            borderRadius: 2,
            margin: "2px 0",
          }}
        />
      )}
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: item.color || "#999",
              flexShrink: 0,
            }}
          />
          <Text className="ml-1">{item.name}</Text>
          <span style={{ fontSize: 11, color: "#999" }}>({item.priority})</span>
        </div>
      </div>
      {insertPosition === 1 && (
        <div
          style={{
            height: 4,
            backgroundColor: "var(--main-color)",
            borderRadius: 2,
            margin: "2px 0",
          }}
        />
      )}
    </>
  );
};

function recalculatePriorities(reordered: TagForIndexedDB[]): {
  updatedItems: TagForIndexedDB[];
  changes: PriorityChange[];
} {
  let counter = 1;
  const changes: PriorityChange[] = [];

  const updatedItems = reordered.map((item) => {
    const newPriority = counter++;
    if (newPriority !== item.priority) {
      changes.push({ id: item.local_id, priority: newPriority });
    }
    return { ...item, priority: newPriority };
  });

  return { updatedItems, changes };
}

export interface ListTagsDragDBHandle {
  saveToIndexedDB: () => PriorityChange[];
}

interface ListTagsDragDBProps {
  saveRef?: React.MutableRefObject<ListTagsDragDBHandle | null>;
  projectId: number;
  tagGroupId: number;
  refreshKey?: number;
}

export default function ListTagsDragDB({
  saveRef,
  projectId,
  tagGroupId,
  refreshKey,
}: ListTagsDragDBProps) {
  // ------------------------------  HOOKS
  const { isReady, getAll, edit } = useIndexedDB<TagForIndexedDB>({
    dbName: "deviceDB",
    storeName: "tags",
  });

  // ------------------------------  STATE
  const [items, setItems] = useState<TagForIndexedDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<PriorityChange[]>([]);

  const pendingChangesRef = useRef<PriorityChange[]>([]);
  useEffect(() => {
    pendingChangesRef.current = pendingChanges;
  }, [pendingChanges]);

  // ------------------------------  DATA FETCH
  useEffect(() => {
    if (!isReady) return;
    setIsLoading(true);
    getAll()
      .then((data) => {
        const filtered = data
          .filter((t) => t.project === projectId && t.tag_group === tagGroupId)
          .sort((a, b) => a.priority - b.priority);
        setItems(filtered);
      })
      .finally(() => setIsLoading(false));
  }, [isReady, getAll, refreshKey, projectId, tagGroupId]);

  // ------------------------------  REF EXPOSE
  useEffect(() => {
    if (saveRef) {
      saveRef.current = {
        saveToIndexedDB: () => {
          const changes = pendingChangesRef.current;
          if (changes.length > 0) {
            changes.forEach(({ id, priority }) => {
              const item = items.find((t) => t.local_id === id);
              if (item) edit({ ...item, priority });
            });
          }
          setPendingChanges([]);
          return changes;
        },
      };
    }
  }, [saveRef, items, edit]);

  const sortableIds = items.map((item) => String(item.local_id));
  const activeIndex = activeId
    ? items.findIndex((item) => String(item.local_id) === activeId)
    : -1;
  const activeItem = activeId
    ? items.find((item) => String(item.local_id) === activeId)
    : null;

  return (
    <div>
      {isLoading && <ListSkeleton count={4} />}

      {!isLoading && (
        <DndContext
          onDragStart={(event) => {
            setActiveId(String(event.active.id));
          }}
          onDragEnd={(event) => {
            setActiveId(null);

            const activeIdStr = String(event.active.id);
            const overIdStr = event.over ? String(event.over.id) : null;

            if (overIdStr && activeIdStr !== overIdStr) {
              setItems((prev) => {
                const dragIndex = prev.findIndex(
                  (item) => String(item.local_id) === activeIdStr,
                );
                const hoverIndex = prev.findIndex(
                  (item) => String(item.local_id) === overIdStr,
                );

                const reordered = arrayMove(prev, dragIndex, hoverIndex);
                const { updatedItems, changes } =
                  recalculatePriorities(reordered);

                if (changes.length > 0) {
                  setPendingChanges((prev) => {
                    const map = new Map(prev.map((c) => [c.id, c]));
                    changes.forEach((c) => map.set(c.id, c));
                    return Array.from(map.values());
                  });
                }

                return updatedItems;
              });
            }
          }}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext items={sortableIds}>
            <div className="flex flex-col gap-2 mt-4">
              {items.length === 0 && <NoData />}
              {items.length > 0 &&
                items.map((item) => (
                  <Card
                    key={item.local_id}
                    item={item}
                    activeIndex={activeIndex}
                  />
                ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItem && (
              <div
                style={{
                  padding: 12,
                  backgroundColor: "#3399ff",
                  border: "1px solid #e1e1e1",
                  borderRadius: 8,
                  color: "white",
                  opacity: 0.9,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: activeItem.color || "#999",
                      flexShrink: 0,
                    }}
                  />
                  <Text className="ml-1">{activeItem.name}</Text>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

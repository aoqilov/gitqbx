import { useState, useRef, useEffect } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@chakra-ui/react";
import Text from "@/components/ui/typography/Text";
import { GrPin } from "react-icons/gr";
import NoData from "@/components/ui/no-data/NoData";

// const dataStatus: ProjectStatus[] = [
//   { priority: 1, color: "#1ff", id: 1, name: "status 1", project: 1 },
//   { priority: 2, color: "#ff3", id: 2, name: "status 2", project: 1 },
//   { priority: 3, color: "#f11", id: 3, name: "status 3", project: 2 },
//   { priority: 4, color: "#f2f", id: 4, name: "status 4", project: 2 },
//   { priority: 5, color: "#a11", id: 5, name: "status 5", project: 2 },
//   { priority: 200, color: "#a453", id: 6, name: "status 6", project: 2 },
//   { priority: 201, color: "#aa2", id: 7, name: "status 7", project: 2 },
// ];

const isLockedPriority = (p?: number): boolean => {
  if (p === undefined) return false;
  return p >= 200;
};

interface PriorityChange {
  id: number;
  priority: number;
}

interface CardProps {
  item: ProjectStatus;
  activeIndex: number;
}

const Card = ({ item, activeIndex }: CardProps) => {
  const id = String(item.id);
  const isLocked = isLockedPriority(item.priority);

  const {
    listeners,
    attributes,
    setNodeRef,
    transition,
    transform,
    active,
    index,
    over,
  } = useSortable({ id, disabled: isLocked });

  const isActive = active?.id === id;
  const insertPosition =
    over?.id === id ? (index > activeIndex ? 1 : -1) : undefined;

  const style: React.CSSProperties = {
    transition,
    padding: 12,
    backgroundColor: isLocked ? "#f5f5f5" : "#fff",
    border: "1px solid #e1e1e1",
    borderRadius: 8,
    position: "relative",
    transform: CSS.Transform.toString(transform),
    opacity: isActive ? 0.5 : isLocked ? 0.6 : 1,
    touchAction: "none",
    cursor: isLocked ? "not-allowed" : "grab",
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
              backgroundColor: item.color || "#000",
              flexShrink: 0,
            }}
          />
          <Text className="ml-1">{item.name}</Text>
          {/* Debug: priority ko'rish uchun */}
          <span style={{ fontSize: 11, color: "#999" }}>({item.priority})</span>
        </div>
        {isLocked && <Icon as={GrPin} color="brand.500" fontSize="16px" />}
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

function recalculatePriorities(reordered: ProjectStatus[]): {
  updatedItems: ProjectStatus[];
  changes: PriorityChange[];
} {
  let editableCounter = 1;
  const changes: PriorityChange[] = [];

  const updatedItems = reordered.map((item) => {
    if (isLockedPriority(item.priority)) {
      return item; // locked — o'zgarmaydi
    }

    const newPriority = editableCounter++;

    if (newPriority !== item.priority) {
      changes.push({ id: item.id, priority: newPriority });
    }

    return { ...item, priority: newPriority };
  });

  return { updatedItems, changes };
}

export interface ListStatusDragHandle {
  saveToBackend: () => PriorityChange[];
}

interface ListStatusDragProps {
  saveRef?: React.MutableRefObject<ListStatusDragHandle | null>;
  dataStatus?: ProjectStatus[]; // Tashqaridan statuslar keladi (yoki default dataStatus ishlatiladi)
}

export default function ListStatusDrag({
  saveRef,
  dataStatus,
}: ListStatusDragProps) {
  const [items, setItems] = useState<ProjectStatus[]>(
    [...(dataStatus ?? [])].sort((a, b) => a.priority - b.priority),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  // Backend ga yuboriladigan o'zgargan itemlar
  const [pendingChanges, setPendingChanges] = useState<PriorityChange[]>([]);

  // pendingChanges ni ref orqali doim yangilab turамиз (stale closure muammosini hal qiladi)
  const pendingChangesRef = useRef<PriorityChange[]>([]);
  useEffect(() => {
    pendingChangesRef.current = pendingChanges;
  }, [pendingChanges]);

  // Tashqaridan chaqirish uchun ref expose qilamiz
  useEffect(() => {
    if (saveRef) {
      saveRef.current = {
        saveToBackend: () => {
          const changes = pendingChangesRef.current;
          setPendingChanges([]);
          return changes;
        },
      };
    }
  }, [saveRef]);

  const sortableIds = items.map((item) => String(item.id));
  const activeIndex = activeId
    ? items.findIndex((item) => String(item.id) === activeId)
    : -1;
  const activeItem = activeId
    ? items.find((item) => String(item.id) === activeId)
    : null;

  return (
    <div>
      <DndContext
        onDragStart={(event) => {
          setActiveId(String(event.active.id));
        }}
        onDragEnd={(event) => {
          setActiveId(null);

          const activeIdStr = String(event.active.id);
          const overIdStr = event.over ? String(event.over.id) : null;

          const draggedItem = items.find(
            (item) => String(item.id) === activeIdStr,
          );
          const targetItem = items.find(
            (item) => String(item.id) === overIdStr,
          );

          // Locked item drag qilinsa yoki locked item ustiga tashlanasa — bekor
          if (isLockedPriority(draggedItem?.priority)) return;
          if (isLockedPriority(targetItem?.priority)) return;

          if (overIdStr && activeIdStr !== overIdStr) {
            setItems((prev) => {
              const dragIndex = prev.findIndex(
                (item) => String(item.id) === activeIdStr,
              );
              const hoverIndex = prev.findIndex(
                (item) => String(item.id) === overIdStr,
              );

              const reordered = arrayMove(prev, dragIndex, hoverIndex);

              // Priority qayta hisoblanadi
              const { updatedItems, changes } =
                recalculatePriorities(reordered);

              // O'zgarishlarni pending ga qo'shamiz (mavjudlarini merge qilib)
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
                <Card key={item.id} item={item} activeIndex={activeIndex} />
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
                    backgroundColor: activeItem.color || "#000",
                    flexShrink: 0,
                  }}
                />
                <Text className="ml-1">{activeItem.name}</Text>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

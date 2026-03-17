import NoData from "@/components/ui/no-data/NoData";
import TemplateList from "@/components/shared/template-list/TemplateList";
import { Button } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

// Minimum kerakli maydonlar
export interface InviteListItem {
  id: string;
  key: string;
  name: string;
}

interface Props<T extends InviteListItem> {
  orgs: T[];
  selectItem: T | null;
  setSelectItem: (item: T) => void;
  // Optional: secondary text getter
  getSecondaryText?: (item: T) => string;
  // Optional: action button label
  actionLabel?: string;
  onAction?: (item: T) => void;
}

function InviteListTemplate<T extends InviteListItem>({
  orgs,
  selectItem,
  setSelectItem,
  getSecondaryText,
  actionLabel = "Отменить",
  onAction,
}: Props<T>) {
  const [items, setItems] = useState<T[]>(orgs);

  const handleAction = (item: T) => {
    if (onAction) {
      onAction(item);
    } else {
      // default: o'chirish
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-300px)]! flex items-center">
        <NoData />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 py-1!">
      <AnimatePresence>
        {items.map((item, index) => (
          <TemplateList
            item={item}
            index={index}
            onClick={(i) => setSelectItem(i)}
            activeItem={selectItem}
            showAvatar
            avatarName={item.name}
            primaryText={item.name}
            secondaryText={
              getSecondaryText ? getSecondaryText(item) : undefined
            }
            height="h-12!"
            activeBorderColor="var(--main-color)"
            activeBgColor="transparent"
            renderRight={(i) => (
              <Button
                size="sm"
                height="26px"
                px={5}
                borderRadius="15px"
                bg="var(--main-color)"
                color="white"
                fontSize="14px"
                fontWeight="400"
                _active={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(i);
                }}
              >
                {actionLabel}
              </Button>
            )}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default InviteListTemplate;

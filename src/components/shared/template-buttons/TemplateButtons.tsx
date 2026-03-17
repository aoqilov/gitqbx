import Button from "@/components/ui/buttons/Button";
import { Icon } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FC, ReactNode } from "react";
import { FaFolderTree } from "react-icons/fa6";
import { GrClear } from "react-icons/gr";
import { LuTrash2 } from "react-icons/lu";
import { TiPlus } from "react-icons/ti";
import { VscEdit } from "react-icons/vsc";

interface PageButtonsProps {
  isSelectionMode: boolean;
  selectedCount: number;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onClear?: () => void;
  onSubTask?: () => void;
  addIcon?: ReactNode;
  editIcon?: ReactNode;
  deleteIcon?: ReactNode;
  showEdit?: boolean;
  showDelete?: boolean;
  showClear?: boolean;
  clearIcon?: ReactNode;
  showSubTask?: boolean;
}

const TemplateButtons: FC<PageButtonsProps> = ({
  isSelectionMode,
  selectedCount,
  onAdd,
  onEdit,
  onDelete,
  onClear,
  onSubTask,
  addIcon,
  editIcon,
  clearIcon,
  deleteIcon,
  showEdit = true,
  showDelete = true,
  showClear = true,
  showSubTask = false,
}) => {
  const MotionBox = motion.div;

  return (
    <div className="fixed bottom-10 right-5 z-10">
      <AnimatePresence mode="wait">
        {/* Add Button */}
        {!isSelectionMode && (
          <MotionBox
            key="add-button"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex gap-2 items-center justify-end"
          >
            <Button
              variant="solid"
              bg="brand.500"
              className="w-9! h-10!"
              onClick={onAdd}
              _active={{ transform: "scale(0.94)" }}
            >
              {addIcon || <Icon as={TiPlus} color="white" fontSize={26} />}
            </Button>
          </MotionBox>
        )}

        {/* Edit & Delete Buttons */}
        {isSelectionMode && (
          <MotionBox
            key="selection-buttons"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex gap-2 items-center justify-end"
          >
            {showSubTask && selectedCount === 1 && (
              <Button
                variant="solid"
                bg="brand.500"
                className="w-9! h-10!"
                _active={{ transform: "scale(0.94)" }}
                onClick={onSubTask}
              >
                {editIcon || (
                  <Icon as={FaFolderTree} color="white" fontSize={26} />
                )}
              </Button>
            )}
            {showEdit && selectedCount === 1 && (
              <Button
                variant="solid"
                bg="brand.500"
                className="w-9! h-10!"
                _active={{ transform: "scale(0.94)" }}
                onClick={onEdit}
              >
                {editIcon || <Icon as={VscEdit} color="white" fontSize={26} />}
              </Button>
            )}

            {showDelete && (
              <Button
                variant="solid"
                bg="brand.500"
                className="w-9! h-10!"
                _active={{ transform: "scale(0.94)" }}
                onClick={onDelete}
              >
                {deleteIcon || (
                  <Icon as={LuTrash2} color="white" fontSize={26} />
                )}
              </Button>
            )}
            {showClear && (
              <Button
                variant="outline"
                borderColor="brand.500"
                className="w-9! h-10!"
                _active={{ transform: "scale(0.94)" }}
                onClick={onClear}
              >
                {clearIcon || (
                  <Icon as={GrClear} color="brand.500" fontSize={26} />
                )}
              </Button>
            )}
          </MotionBox>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateButtons;

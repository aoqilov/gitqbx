import { chakra, Icon } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom"; // yoki next/router
import Avatar from "@/components/ui/avatar/Avatar";
import Checkbox from "@/components/ui/checkbox/Checkbox";
import Text from "@/components/ui/typography/Text";
import { listItemVariants } from "@/plugin/animation-framer/animateList";

const MotionFlex = chakra(motion.div);

interface CheckListTemplateProps<T extends { id: string | number }> {
  item: T;
  index: number | string;

  // Selection mode
  selectable?: boolean;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onPressStart?: (item: T) => void;
  onPressEnd?: () => void;
  onCheckboxChange?: (item: T) => void;

  // Click handler
  onClick?: (item: T) => void;

  // Routing
  navigateTo?: string; // Path string
  navigateState?: any; // State to pass

  // Active state
  activeItem?: T | null;

  // Render props
  renderLeft?: (item: T) => ReactNode;
  renderRight?: (item: T) => ReactNode;

  // Avatar
  showAvatar?: boolean;
  avatarSrc?: string;
  avatarName?: string;

  // Icon
  showIcon?: boolean;
  icon?: any;
  iconColor?: string;
  iconSize?: number | string;

  // Text
  primaryText?: string;
  secondaryText?: string;
  rightText?: string;

  // Styling
  className?: string;
  activeTextColor?: string;
  borderColor?: string;
  activeBorderColor?: string;
  activeBgColor?: string;
  height?: string;
  animation?: boolean;
}

function TemplateList<T extends { id: string | number }>({
  item,
  // index animatsiya uchun kerak, har bir elementga alohida delay berish uchun
  index,
  selectable = false,
  isSelectionMode = false,
  isSelected = false,
  onPressStart,
  onPressEnd,
  onCheckboxChange,
  onClick,
  navigateTo,
  navigateState,
  activeItem,
  // for UI customization
  renderLeft,
  renderRight,
  showAvatar = false,
  avatarSrc,
  avatarName,
  showIcon = false,
  icon,
  iconColor = "var(--icon-lbrand-dwhite50)",
  iconSize = "16px",
  primaryText,
  secondaryText,
  rightText,
  className = "",
  borderColor = "var(--border-list)",
  activeTextColor = "#fff",
  activeBorderColor = "var(--main-color)",
  activeBgColor = "var(--main-color)",
  height = "h-10!",
  animation = true,
}: CheckListTemplateProps<T>) {
  const navigate = useNavigate();

  const handleClick = () => {
    // 1. Selection mode bo'lsa - checkbox
    if (selectable && isSelectionMode && onCheckboxChange) {
      onCheckboxChange(item);
      return;
    }

    // 2. onClick handler bo'lsa (active qilish ham shu yerda)
    if (onClick) {
      onClick(item);
    }

    // 3. Navigate path bo'lsa
    if (navigateTo) {
      navigate(navigateTo, { state: navigateState });
    }
  };

  const isItemActive = activeItem ? activeItem.id == item.id : false;

  return (
    <MotionFlex
      key={item.id}
      custom={index}
      variants={animation ? listItemVariants : undefined}
      initial={animation ? "hidden" : undefined}
      animate={animation ? "visible" : undefined}
      exit={animation ? "exit" : undefined}
      onMouseDown={
        selectable && onPressStart ? () => onPressStart(item) : undefined
      }
      onMouseUp={selectable && onPressEnd ? onPressEnd : undefined}
      onMouseLeave={selectable && onPressEnd ? onPressEnd : undefined}
      onTouchStart={
        selectable && onPressStart ? () => onPressStart(item) : undefined
      }
      onTouchEnd={selectable && onPressEnd ? onPressEnd : undefined}
      onClick={handleClick}
      className={`flex items-center justify-between relative ${height} px-4! ${className}`}
      border="1px"
      borderRadius="10px"
      borderStyle="solid"
      borderColor={isItemActive ? activeBorderColor : borderColor}
      bg={isItemActive ? activeBgColor : "transparent"}
      color="var(--main-color)"
      cursor={
        (selectable && isSelectionMode) || onClick || navigateTo
          ? "pointer"
          : "default"
      }
      transition="all 0.2s ease"
      _hover={
        (selectable && isSelectionMode) || onClick || navigateTo
          ? {
              bg: isItemActive ? activeBgColor : "var(--hover-bg)",
              borderColor: isItemActive
                ? activeBorderColor
                : "var(--hover-border)",
            }
          : {}
      }
      _active={{
        transform: "scale(0.98)",
      }}
    >
      {/* Left side */}
      <div className="flex gap-2! items-center">
        {selectable && (
          <AnimatePresence>
            {isSelectionMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Checkbox
                  label=""
                  checked={isSelected}
                  onChange={() => onCheckboxChange?.(item)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {renderLeft ? (
          renderLeft(item)
        ) : (
          <>
            {showAvatar && (
              <Avatar
                avatar={avatarSrc || ""}
                fullName={avatarName || ""}
                w="32px"
                h="32px"
              />
            )}

            {showIcon && icon && (
              <div className=" rounded-full flex items-center justify-center border border-(--main-color) ">
                <Icon
                  as={icon}
                  color={isItemActive ? "white" : iconColor}
                  fontSize={iconSize}
                />
              </div>
            )}

            <div className=" max-w-[200px]">
              <Text
                fontWeight={isItemActive ? "600" : "500"}
                fontSize="1em"
                truncate
                color={
                  isItemActive
                    ? activeTextColor
                    : "var(--text-lblack-dgreydark)"
                }
              >
                {primaryText}
              </Text>
              {secondaryText && (
                <Text
                  truncate
                  fontWeight="500"
                  fontSize="0.65em"
                  color={
                    isItemActive
                      ? activeTextColor
                      : "var(--text-lblack-dgreydark)"
                  }
                >
                  {secondaryText}
                </Text>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right side */}
      {rightText && (
        <Text
          fontSize="0.85em"
          whiteSpace="nowrap"
          color={isItemActive ? "#fff" : "var(--text-lgray-dgreydark)"}
        >
          {rightText}
        </Text>
      )}
      {renderRight && <div>{renderRight(item)}</div>}
    </MotionFlex>
  );
}

export default TemplateList;

//
//
//
//
//
//
//

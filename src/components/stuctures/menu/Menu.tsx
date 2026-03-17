import { defineSlotRecipe, Drawer, Portal } from "@chakra-ui/react";
import { FC, useState, ReactNode } from "react";
import Notification from "@/components/ui/notification/Notification";
import MainIconBtn from "@/components/ui/buttons/MainIconBtn";
import { FaBars } from "react-icons/fa";
import { drawerAnatomy } from "@chakra-ui/react/anatomy";

import MenuDefault from "./menu-default/MenuDefault";
import MenuSettings from "./menu-settings/MenuSettings";
import MenuProfile from "./menu-profile/MenuProfile";
import { AnimatePresence, motion } from "framer-motion";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import MenuFamily from "./menu-family/MenuFamily";
import MenuOrganization from "./menu-organization/MenuOrganization";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { duration } from "moment";
import Text from "@/components/ui/typography/Text";

export const drawerSlotRecipe = defineSlotRecipe({
  slots: drawerAnatomy.keys(),
  base: {},
  variants: {
    size: {
      mobile: {
        content: {
          maxW: "88vw",
        },
      },
    },
  },
});

// Animatsiya variantlari — har doim o'ngdan kiradi, chapga chiqadi
const slideVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1, duration: 0 },
  exit: { x: "5%", opacity: 0, duration: 0 },
};

const slideTransition = {
  duration: 0.13, // umumiy davomiylik
};

// Mode → komponent mapping2
const menuComponents: Record<
  string,
  FC<{ closeDrawer: () => void; children?: ReactNode }>
> = {
  default: MenuDefault,
  profile: MenuProfile,
  settings: MenuSettings,
  organization: MenuOrganization,
  family: MenuFamily,
};

const Menu: FC = () => {
  const mode = useSelector((state: RootState) => state.params.menuMode);
  const [open, setOpen] = useState(false);

  const ActiveMenu = menuComponents[mode] ?? MenuDefault;

  return (
    <Drawer.Root
      placement="start"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size="full"
    >
      <Notification isNotify={true}>
        <Drawer.Trigger asChild>
          <MainIconBtn
            size="md"
            icon={FaBars}
            variant="outline"
            borderColor="brand.500"
            iColor="brand.500"
            onClick={() => setOpen(true)}
          />
        </Drawer.Trigger>
      </Notification>

      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content style={{ overflow: "hidden", position: "relative" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={slideTransition}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ScrollArea height={"100%"} size={"xs"} orientation="vertical">
                  <ActiveMenu closeDrawer={() => setOpen(false)}></ActiveMenu>
                </ScrollArea>
              </motion.div>
            </AnimatePresence>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default Menu;

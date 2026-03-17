import Avatar from "@/components/ui/avatar/Avatar";
import { ColorModeButton } from "@/components/ui/provider/color-mode";
import Heading from "@/components/ui/typography/Heading";
import Subtext from "@/components/ui/typography/SubText";
import { useEffect, useState } from "react";
import DegreeCount from "../ui/DegreeCount";
import Separator from "@/components/ui/separator/Separator";
import NavButton from "@/components/ui/buttons/NavButton";
import {
  getMenuItems,
  getMenuItemsFamily,
  getMenuItemsFooter,
  getMenuItemsOrganization,
  menuItems,
  menuItemsFooter,
} from "../MenuList";
import { Icon, Image } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Text from "@/components/ui/typography/Text";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import Button from "@/components/ui/buttons/Button";
import { FaXmark } from "react-icons/fa6";
import { setMenuMode, setWorkspaceMode } from "@/store/params/params.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { WorkspaceMode } from "@/store/params/enums";
import { useTranslation } from "@/i18n/languageConfig";

type PropsPage = {
  closeDrawer: () => void;
};

const MenuDefault = ({ closeDrawer }: PropsPage) => {
  // -----------------------------------------------  HOOKS
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { workspaceMode } = useSelector((state: RootState) => state.params);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  // -----------------------------------------------  STATES

  const [isShort, setIsShort] = useState(false);

  // ----------------------------------------------- FUNCTIONS
  const menuItems = getMenuItems(t);

  const menuItemsFooter = getMenuItemsFooter(t);

  return (
    <div>
      {/* top image */}
      <div
        className={`w-full relative transition-all duration-500 ease-in-out h-[205px]!`}
      >
        <Image
          className="w-full h-full!  rounded-b-[30px]!"
          src="/assets/images/menuBackImage.png"
          alt="menubackimg"
          objectFit=""
        />

        <div
          className=" z-20! absolute right-8 bottom-[20%] bg-[#711ce9b8] rounded-full p-1! "
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon fontSize={20} color={"#fff"} as={FaXmark} />
        </div>
      </div>
      {/* main user */}
      <div
        className={` min-h-100 max-w-[90%] mx-auto! relative bottom-7.5 rounded-[20px]  shadow-md pt-30! pb-5! bg-(--bg-sidebar-second)`}
      >
        {/* user-info */}
        <div className=" w-full absolute left-[50%] -top-12.5 -translate-x-1/2 text-center">
          <Avatar
            size="size100"
            ring="ringWhite"
            fullName={"menuUser"}
            avatar={user.user?.telegram_avatar!}
          />
          <Heading className="text-[15px]! mt-5!">
            {user.user?.fullname}
          </Heading>
          <Subtext className="mt-0.5!">{user.user?.telegram_username}</Subtext>
          <div className="absolute right-4 top-[50%]! w-7.5 h-7.5 ">
            <ColorModeButton />
          </div>
          <div className="absolute left-4 top-[50%]!">
            <div className="w-7.5 h-7.5 ">
              <DegreeCount percent={47} size={32} color="var(--main-color)" />
            </div>
          </div>
        </div>
        <Separator size="md" variant="solid" className="w-[90%]! mx-auto!" />
        {/* user-menu */}
        <div>
          <Button
            key={"profile"}
            variant={"nav"}
            onClick={() => {
              dispatch(setMenuMode("profile"));
            }}
            _active={{
              transform: "scale(0.96)",
            }}
          >
            <Icon as={FaRegUserCircle} fontSize={20} />
            <Text color={"var(--text-def)"}>
              {t("menu.menuDefault.myProfile")}
            </Text>
          </Button>
          <Button
            key={"settings"}
            variant={"nav"}
            _active={{
              transform: "scale(0.96)",
            }}
            onClick={() => {
              dispatch(setMenuMode("settings"));
            }}
          >
            <Icon as={IoSettingsOutline} fontSize={20} />
            <Text color={"var(--text-def)"}>
              {t("menu.menuDefault.settings")}
            </Text>
          </Button>
        </div>

        <Separator size="sm" variant="solid" className="w-[90%]! mx-auto!" />
        {/* menu-main-list */}
        {menuItems.map((item) => {
          // Check if current item is active
          let isActive = false;

          if (item.key === "m2") {
            // Organization button active when on /workspace page AND mode is Organization
            isActive =
              pathname === "/workspace" &&
              workspaceMode === WorkspaceMode.Organization;
          } else if (item.key === "m3") {
            // Family button active when on /workspace page AND mode is Family
            isActive =
              pathname === "/workspace" &&
              workspaceMode === WorkspaceMode.Family;
          } else {
            // For other items, check exact pathname match
            isActive = pathname === item.link;
          }

          return (
            <NavButton
              key={item.key}
              variant={"nav"}
              hasNotification={item.hasNotification}
              isActive={isActive}
              onClick={() => {
                navigate(item.link);

                if (item.key === "m1") {
                  dispatch(setWorkspaceMode(WorkspaceMode.Device));
                }

                if (item.key === "m2") {
                  dispatch(setWorkspaceMode(WorkspaceMode.Organization));
                }

                if (item.key === "m3") {
                  dispatch(setWorkspaceMode(WorkspaceMode.Family));
                }
                setTimeout(() => {}, 500);

                setTimeout(() => {
                  closeDrawer();
                }, 300);
              }}
            >
              {item.icon}
              {item.title}
            </NavButton>
          );
        })}
      </div>
      {/* footer */}
      <div className="max-w-[90%]  mx-auto! pb-5!   ">
        <Separator size={"sm"} className="my-2.5!" />
        {menuItemsFooter.map((item) => {
          const isActive = pathname === item.link;
          return (
            <NavButton
              key={item.key}
              variant={"footerNav"}
              hasNotification={item.hasNotification}
              isActive={isActive}
              onClick={() => {
                navigate(item.link);
                closeDrawer();
              }}
            >
              {item.icon}
              {item.title}
            </NavButton>
          );
        })}
      </div>
    </div>
  );
};

export default MenuDefault;

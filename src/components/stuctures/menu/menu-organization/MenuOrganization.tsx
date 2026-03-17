import Avatar from "@/components/ui/avatar/Avatar";
import { ColorModeButton } from "@/components/ui/provider/color-mode";
import Heading from "@/components/ui/typography/Heading";
import Subtext from "@/components/ui/typography/SubText";
import { useEffect, useState } from "react";
import DegreeCount from "../ui/DegreeCount";
import Separator from "@/components/ui/separator/Separator";
import NavButton from "@/components/ui/buttons/NavButton";
import { getMenuItemsFooter, getMenuItemsOrganization } from "../MenuList";
import { Box, Icon, Image } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Text from "@/components/ui/typography/Text";

import { FaXmark } from "react-icons/fa6";
import { setMenuMode, setWorkspaceMode } from "@/store/params/params.slice";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { globalParams } from "@/utils/globalParams";
import { WorkspaceMode } from "@/store/params/enums";
import { useTranslation } from "@/i18n/languageConfig";

type PropsPage = {
  closeDrawer: () => void;
};

const MenuOrganization = ({ closeDrawer }: PropsPage) => {
  // -----------------------------------------------  HOOKS
  const { workspaceID } = globalParams();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { workspaceName } = useSelector((state: RootState) => state.params);
  const { t } = useTranslation();
  const menuItemsOrganization = getMenuItemsOrganization(t);
  const menuItemsFooter = getMenuItemsFooter(t);

  // -----------------------------------------------  STATES

  const [isShort, setIsShort] = useState(false);

  // ----------------------------------------------- FUNCTIONS
  return (
    <div>
      <div className="relative  h-full! bg-(--bg-main)">
        {/* top image */}
        <div
          className={`w-full relative transition-all duration-500 ease-in-out  ${"max-h-63.75"}`}
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
            <Subtext className="mt-0.5!">
              {user.user?.telegram_username}
            </Subtext>
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
          <div className=" w-[90%]! mx-auto! my-1!">
            <div>
              <Text fontSize={"0.85em"} color={"var(--text-subtext)"}>
                {t("workspace.organization")}
              </Text>
              <Text fontSize={"1em"} color={"brand.500"}>
                {workspaceName}
              </Text>
            </div>
            <Box
              className="flex items-center gap-1 h-10"
              _active={{
                transform: "scale(0.96)",
              }}
              onClick={() => {
                dispatch(setMenuMode("default"));
                dispatch(setWorkspaceMode(WorkspaceMode.Device));
                navigate(`/workspace/def/tasks`);
                closeDrawer();
              }}
            >
              <Icon as={MdOutlineKeyboardBackspace} fontSize={20} />
              <Text color={"var(--text-def)"}>{t("menu.backtoMyTask")}</Text>
            </Box>
          </div>

          <Separator size="sm" variant="solid" className="w-[90%]! mx-auto!" />
          {/* menu-main-list */}
          {menuItemsOrganization.map((item) => {
            const isPayment = item.link === "app/payments/payment";

            // Extract workspaceID from pathname if globalParams doesn't work
            const pathnameWorkspaceID = pathname.split("/")[2]; // /workspace/1/tasks -> "1"
            const currentWorkspaceID = workspaceID || pathnameWorkspaceID;

            const itemLink = isPayment
              ? "/app/payments/payment"
              : `/workspace/${currentWorkspaceID}/${item.link}`;

            const isActive = pathname.startsWith(itemLink);

            return (
              <NavButton
                key={item.key}
                variant={"nav"}
                hasNotification={item.hasNotification}
                isActive={isActive}
                onClick={() => {
                  if (item.link === "app/payments/payment") {
                    navigate(`/app/payments/payment`);
                    closeDrawer();
                    return;
                  }
                  navigate(`/workspace/${currentWorkspaceID}/${item.link}`);

                  closeDrawer();
                }}
              >
                {item.icon}
                {item.title}
              </NavButton>
            );
          })}
        </div>
        {/* footer */}
        <div className="max-w-[90%]  mx-auto! pb-5!  ">
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

      <div className="absolute left-15 top-20"></div>
    </div>
  );
};

export default MenuOrganization;

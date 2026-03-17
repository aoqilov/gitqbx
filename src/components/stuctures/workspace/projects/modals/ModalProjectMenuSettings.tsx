import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import { Span } from "@chakra-ui/react";
import { LuCheckCheck } from "react-icons/lu";
import Text from "@/components/ui/typography/Text";
import { PiFolderSimpleStarFill } from "react-icons/pi";
import {
  LuRefreshCcw,
  LuUsers,
  LuVenetianMask,
  LuScale,
  LuHash,
  LuLayers,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { IconType } from "react-icons";
import { useEffect, useState } from "react";
import { globalParams } from "@/utils/globalParams";
import { useDispatch, useSelector } from "react-redux";
import { setProjectNameForHeader } from "@/store/params/params.slice";
import TemplateList from "@/components/shared/template-list/TemplateList";
import { useActions } from "@/hooks/use-actions/useActions";
import { RootState } from "@/store";
import { getUID, ProjectForIndexedDB } from "../types";
import { useTranslation } from "@/i18n/languageConfig";

interface Props extends ModalProps {
  activeItem: Project | ProjectForIndexedDB | null;
  cancelSelection: () => void;
}
interface ProjectMenuItem {
  id: number; // Obyektdagi noyob identifikator
  name: string; // Menyuda ko'rinadigan matn
  icon: IconType; // React-icons komponenti tipi
  path: string; // Navigatsiya uchun yo'l
}

export const ModalProjectMenuSettings = ({
  open,
  close,
  activeItem,
}: Props) => {
  const { t } = useTranslation("menu.menuWorkspace.");
  const projectMenu: ProjectMenuItem[] = [
    {
      id: 1,
      name: t("routineTasks"),
      icon: LuRefreshCcw,
      path: "routine-tasks",
    },
    {
      id: 2,
      name: t("members"),
      icon: LuUsers,
      path: "members",
    },
    {
      id: 3,
      name: t("roles"),
      icon: LuVenetianMask,
      path: "roles",
    },
    {
      id: 4,
      name: t("policies"),
      icon: LuScale,
      path: "policies",
    },
    {
      id: 5,
      name: t("statuses"),
      icon: LuCheckCheck,
      path: "statuses",
    },
    {
      id: 6,
      name: t("tagsGroup"),
      icon: LuHash,
      path: "tags-group",
    },
    {
      id: 7,
      name: t("themes"),
      icon: LuLayers,
      path: "themes",
    },
  ];
  // ----------------------------------  HOOKS
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workspaceID } = globalParams();
  const { workspaceMode } = useSelector((state: RootState) => state.params);
  const {
    setProjectRoles,
    setProjectTagsGroup,
    setProjectThemes,
    setProjectStatuses,
  } = useActions();

  // ----------------------------------  STATES
  const [menuActiveItem, setMenuActiveItem] = useState<ProjectMenuItem | null>(
    null,
  );

  useEffect(() => {
    if (!activeItem || workspaceMode === "device") return;
    // workspaceMode !== "device" bo'lganda faqat Project (id: number) keladi
    if (!("workspace" in activeItem)) return;

    const projectId = activeItem.id;

    setProjectRoles({ projectId, roles: activeItem.roles });
    setProjectTagsGroup({ projectId, tagsGroup: activeItem.tagsGroup });
    setProjectThemes({ projectId, themes: activeItem.themes });
    setProjectStatuses({ projectId, statuses: activeItem.statuses });
    // setProjectMembers(activeItem.members);
  }, [activeItem, workspaceMode]);
  // ----------------------------------  FUNCTIONS
  const handleSubmitMenu = async (item: ProjectMenuItem) => {
    if (!activeItem) return;

    const projectId = getUID(activeItem);
    navigate(`/workspace/${workspaceID}/projects/${projectId}/${item.path}`);
    setMenuActiveItem(item);
    dispatch(setProjectNameForHeader(activeItem.name || ""));
    close();
  };

  return (
    <DrawerComponentBasic
      open={open}
      onOpenChange={close}
      title={t("title")}
      titleIcon={PiFolderSimpleStarFill}
      onSubmit={handleSubmitMenu}
      buttonHide
    >
      {() => (
        <div>
          <div>
            {/* header */}
            <Text fontSize={"1.14em"}>
              {t("project")}:{" "}
              <Span color={"brand.500"} fontWeight={"bold"}>
                {activeItem?.name}
              </Span>
            </Text>
            {/* menu */}
            <div className=" flex flex-col gap-1.5 pb-20! pt-4!">
              {projectMenu
                .filter((item) => {
                  if (workspaceMode === "device") {
                    const notVisibleIDS = [1, 2, 3, 4];
                    return !notVisibleIDS.includes(item.id);
                  } else {
                    return true;
                  }
                })
                .map((item, index) => {
                  return (
                    <TemplateList
                      key={item.id}
                      onClick={(item) => {
                        handleSubmitMenu(item);

                        console.log(item);
                      }}
                      activeItem={menuActiveItem}
                      showIcon
                      icon={item.icon}
                      primaryText={item.name}
                      item={item}
                      index={index}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </DrawerComponentBasic>
  );
};

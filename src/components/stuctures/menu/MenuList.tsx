
import { FaTasks } from "react-icons/fa";
import { GoOrganization, GoHome } from "react-icons/go";
import { IoMdSync } from "react-icons/io";
import { FaMoneyBills, FaHeadphones } from "react-icons/fa6";
import { TfiStatsUp } from "react-icons/tfi";
import { BsShieldLock } from "react-icons/bs";
import { GrHelpBook } from "react-icons/gr";
import { HiOutlineHashtag, HiOutlineUsers } from "react-icons/hi";
import { MdOutlineFolderCopy, MdOutlineOutlinedFlag } from "react-icons/md";
import { LiaMaskSolid } from "react-icons/lia";
import { TbListCheck } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { LuFolder } from "react-icons/lu";

// ❌ Eski — hook module darajasida
// const { t } = useTranslation();

// ✅ t funksiyani tashqaridan oladi
type TFunc = (key: string) => string;

export const getMenuItemsOrganization = (t: TFunc) => [
  {
    key: "o1",
    title: t("menu.organizationMenu.tasks"),
    link: "tasks",
    icon: <TbListCheck />,
    hasNotification: false,
  },
  {
    key: "o2",
    title: t("menu.organizationMenu.projectsManagement"),
    link: "projects",
    icon: <MdOutlineFolderCopy />,
    hasNotification: false,
  },
  {
    key: "o3",
    title: t("menu.organizationMenu.membersManagement"),
    link: "members",
    icon: <HiOutlineUsers />,
    hasNotification: false,
  },
  {
    key: "o4",
    title: t("menu.organizationMenu.rolesManagement"),
    link: "roles",
    icon: <LiaMaskSolid />,
    hasNotification: false,
  },
  {
    key: "o5",
    title: t("menu.organizationMenu.teamsManagement"),
    link: "teams",
    icon: <MdOutlineOutlinedFlag />,
    hasNotification: false,
  },
  {
    key: "o6",
    title: t("menu.organizationMenu.organizationSettings"),
    link: "params",
    icon: <IoSettingsOutline />,
    hasNotification: false,
  },
  {
    key: "o7",
    title: t("menu.organizationMenu.reports"),
    link: "reports",
    icon: <TfiStatsUp />,
    hasNotification: false,
  },
  {
    key: "o8",
    title: t("menu.organizationMenu.payments"),
    link: "app/payments/payment",
    icon: <FaMoneyBills />,
    hasNotification: false,
  },
];

export const getMenuItemsFamily = (t: TFunc) => [
  {
    key: "f1",
    title: t("menu.familyMenu.tasks"),
    link: "tasks",
    icon: <FaTasks />,
    hasNotification: false,
  },
  {
    key: "f2",
    title: t("menu.familyMenu.membersManagement"),
    link: "members",
    icon: <HiOutlineUsers />,
    hasNotification: false,
  },
  {
    key: "f3",
    title: t("menu.familyMenu.rolesManagement"),
    link: "roles",
    icon: <LiaMaskSolid />,
    hasNotification: false,
  },
  {
    key: "f4",
    title: t("menu.familyMenu.paramsManagement"),
    link: "params",
    icon: <HiOutlineHashtag />,
    hasNotification: false,
  },
  {
    key: "f5",
    title: t("menu.familyMenu.payments"),
    link: "/app/payments/payment",
    icon: <FaMoneyBills />,
    hasNotification: false,
  },
];

export const getMenuItems = (t: TFunc) => [
  {
    key: "m1",
    title: t("menu.menuDefault.myTasks"),
    link: "/workspace/def/tasks",
    icon: <FaTasks />,
    hasNotification: false,
  },
  {
    key: "m1.1",
    title: t("menu.menuDefault.myProjects"),
    link: "/workspace/def/projects",
    icon: <LuFolder />,
    hasNotification: false,
  },
  {
    key: "m2",
    title: t("menu.menuDefault.organizations"),
    link: "/workspace",
    icon: <GoOrganization />,
    hasNotification: false,
  },
  {
    key: "m3",
    title: t("menu.menuDefault.family"),
    link: "/workspace",
    icon: <GoHome />,
    hasNotification: false,
  },
  {
    key: "m4",
    title: t("menu.menuDefault.sync"),
    link: "/workspace/def/sync",
    icon: <IoMdSync />,
    hasNotification: false,
  },
  {
    key: "m5",
    title: t("menu.menuDefault.payments"),
    link: "/app/payments/payment",
    icon: <FaMoneyBills />,
    hasNotification: false,
  },
  {
    key: "m6",
    title: t("menu.menuDefault.statistics"),
    link: "/workspace/def/reports",
    icon: <TfiStatsUp />,
    hasNotification: false,
  },
];

export const getMenuItemsFooter = (t: TFunc) => [
  {
    key: "mf1",
    title: t("menu.footerMenu.privacyPolicy"),
    link: "/app/payments/card-link",
    icon: <BsShieldLock />,
    hasNotification: false,
  },
  {
    key: "mf2",
    title: t("menu.footerMenu.guideHelp"),
    link: "/app/payments",
    icon: <GrHelpBook />,
    hasNotification: false,
  },
  {
    key: "mf3",
    title: t("menu.footerMenu.support"),
    link: "/app/payments/offer",
    icon: <FaHeadphones />,
    hasNotification: false,
  },
];

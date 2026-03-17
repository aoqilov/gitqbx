import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import IconsAllList from "@/views/project-pages/themes-view/list-icons/IconsAllList";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { showToast } from "@/utils/showToaster";
import { iconList } from "@/constants/iconList";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { BiLayerPlus } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { VscEdit } from "react-icons/vsc";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import { Icon } from "@chakra-ui/react";
import Text from "@/components/ui/typography/Text";
import { IoClose } from "react-icons/io5";
import { ThemeForIndexedDB } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { postTheme, putTheme } from "@/service/themes-route";
import { globalParams } from "@/utils/globalParams";

const iconPacks = { ...FaIcons, ...MdIcons, ...AiIcons };

type UserForm = {
  themeName: string;
  /** iconList dagi icon nomi (string) — saqlashdan oldin index ga o'giriladi */
  temaIcon: string;
};

interface ThemeAddEditDBProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  projectId: number;
  initialData?: ThemeForIndexedDB | ProjectTheme | null;
  onSuccess?: () => void;
}

export const ModalProjectThemeAddEditDB = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
  projectId,
  onSuccess,
}: ThemeAddEditDBProps) => {
  const isEdit = mode === "edit";
  const [iconPanelOpen, setIconPanelOpen] = useState(false);
  const iconPanelRef = useRef<HTMLDivElement>(null);

  const { payment } = useSelector((state: RootState) => state.params);
  const { projectID } = globalParams();

  // -------------------------------------- HOOKS
  const { isReady, add, edit, get } = useIndexedDB<ThemeForIndexedDB>({
    dbName: "deviceDB",
    storeName: "theme",
  });

  // icon nomi (string) dan iconList index (number) ga o'giruvchi helper
  const resolveIconIndex = (iconName: string): number => {
    const entry = iconList.find((i) => i.icon === iconName);
    return entry?.index ?? 0;
  };

  // icon index dan icon nomiga qaytuvchi helper (edit mode uchun)
  const resolveIconName = (index: number): string => {
    return iconList.find((i) => i.index === index)?.icon ?? "";
  };

  useEffect(() => {
    if (!iconPanelOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        iconPanelRef.current &&
        !iconPanelRef.current.contains(e.target as Node)
      ) {
        setIconPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [iconPanelOpen]);

  // -------------------------------------- API HANDLERS
  const handleAddAPI = async (data: UserForm) => {
    const iconIndex = resolveIconIndex(data.temaIcon);
    await postTheme({
      projectID: +projectID!,
      data: { name: data.themeName, icon: iconIndex },
    });
  };

  const handleEditAPI = async (data: UserForm) => {
    if (!initialData?.id) {
      console.warn("No initialData id for API edit");
      return;
    }
    const iconIndex = resolveIconIndex(data.temaIcon);
    await putTheme({
      projectID: +projectID!,
      themeID: Number(initialData.id),
      data: { name: data.themeName, icon: iconIndex },
    });
    cancelSelection();
  };

  // -------------------------------------- IDB HANDLERS
  const handleAddIDB = async (data: UserForm) => {
    if (!isReady) return;
    const iconIndex = resolveIconIndex(data.temaIcon);
    const newTheme: ThemeForIndexedDB = {
      local_id: Number(`105${Date.now() % 10000}`),
      id: null,
      project: projectId,
      name: data.themeName,
      icon: iconIndex,
      createdAt: Date.now(),
    };
    await add(newTheme);
  };

  const handleEditIDB = async (data: UserForm) => {
    if (!isReady) return;
    if (!initialData || !("local_id" in initialData) || !initialData.local_id) {
      console.warn("No initialData local_id for IDB edit");
      return;
    }
    const iconIndex = resolveIconIndex(data.temaIcon);
    const existing = await get(initialData.local_id);
    const updated: ThemeForIndexedDB = {
      local_id: initialData.local_id,
      id: existing?.id ?? null,
      project: projectId,
      name: data.themeName,
      icon: iconIndex,
      createdAt: initialData.createdAt,
    };
    await edit(updated);
    cancelSelection();
  };

  // -------------------------------------- MAIN SUBMIT
  const handleSubmitUser = async (data: UserForm) => {
    try {
      if (payment) {
        isEdit ? await handleEditAPI(data) : await handleAddAPI(data);
      } else {
        isEdit ? await handleEditIDB(data) : await handleAddIDB(data);
      }
      showToast({ type: "success" });
      onSuccess?.();
      close();
    } catch (error) {
      console.error(error);
      showToast({ type: "error" });
    }
  };

  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      title={isEdit ? "Редактировать тему" : "Добавление темы"}
      titleIcon={isEdit ? VscEdit : BiLayerPlus}
      buttonLabel={isEdit ? "Сохранить изменения" : "Готово"}
      onSubmit={handleSubmitUser}
      defaultValues={{
        themeName: isEdit ? initialData?.name || "" : "",
        temaIcon: isEdit ? resolveIconName(initialData?.icon ?? 0) : "",
      }}
    >
      {(form) => {
        const { setValue, control, watch } = form;
        const selectedIcon = watch("temaIcon");
        const SelectedIconComponent = selectedIcon
          ? (iconPacks[selectedIcon as keyof typeof iconPacks] as any)
          : null;

        return (
          <div className="flex gap-0 overflow-hidden relative">
            {/* ── Asosiy forma ── */}
            <motion.div
              animate={{ x: iconPanelOpen ? "-30%" : "0%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full shrink-0 flex flex-col gap-5! pb-20!"
            >
              <Controller
                name="themeName"
                control={control}
                rules={{ required: "Напишите название темы" }}
                render={({ field, fieldState }) => (
                  <InputForm
                    maxLength={100}
                    label="Название темы"
                    placeholder="Введите название темы"
                    {...field}
                    isRequired
                    error={fieldState.error?.message}
                    clearMethod={() => setValue("themeName", "")}
                  />
                )}
              />

              {/* Icon tanlash tugmasi */}
              <div
                className="flex items-center gap-2 cursor-pointer w-fit"
                onClick={() => setIconPanelOpen(true)}
              >
                {SelectedIconComponent ? (
                  <div className="flex items-center gap-2 px-3! py-1.5! rounded-[20px]! border border-(--main-color) bg-[#DABFFF30]">
                    <Icon
                      as={SelectedIconComponent}
                      fontSize={18}
                      color="brand.500"
                    />
                    <Text fontSize="0.85em" color="brand.500">
                      {selectedIcon}
                    </Text>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3! py-1.5! rounded-[20px]! border! border-(--border-input)!">
                    <Icon as={FaPlus} fontSize={14} color="var(--main-color)" />
                    <Text fontSize="0.85em" color="var(--text-label)">
                      Добавить иконку
                    </Text>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── Icon panel (pastdan sliding) ── */}
            <AnimatePresence>
              {iconPanelOpen && (
                <motion.div
                  ref={iconPanelRef}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed bottom-0! left-0 w-full max-h-150! bg-(--bg-main) flex flex-col pb-10!"
                  style={{
                    boxShadow: "0 -4px 16px rgba(0,0,0,0.15)",
                    borderRadius: "16px 16px 0 0",
                    zIndex: 1500,
                  }}
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4! py-3! border-b border-(--border-input)">
                    <Text fontSize="0.95em" fontWeight="600">
                      Выберите иконку
                    </Text>
                    <div
                      className="cursor-pointer"
                      onClick={() => setIconPanelOpen(false)}
                    >
                      <Icon as={IoClose} fontSize={20} />
                    </div>
                  </div>

                  {/* Icon list scroll */}
                  <div className="overflow-y-auto! max-h-400! flex-1 p-3!">
                    <IconsAllList
                      selectedIcon={selectedIcon}
                      onSelect={(iconName) => {
                        setValue("temaIcon", iconName);
                        setIconPanelOpen(false);
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }}
    </DrawerComponentBasic>
  );
};

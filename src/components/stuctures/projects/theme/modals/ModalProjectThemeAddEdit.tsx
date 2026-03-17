import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import IconsAllList from "@/views/project-pages/themes-view/list-icons/IconsAllList";
import { showToast } from "@/utils/showToaster";
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
import { useMutation } from "@tanstack/react-query";
import { postTheme, putTheme } from "@/service/themes-route";
import { useActions } from "@/hooks/use-actions/useActions";
import { globalParams } from "@/utils/globalParams";
import { iconList } from "@/constants/iconList";

const iconPacks = { ...FaIcons, ...MdIcons, ...AiIcons };

type UserForm = {
  themeName: string;
  temaIcon: string;
};

interface RoleProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    id: number;
    name: string;
    icon?: number;
  } | null;
}

export const ModalProjectThemeAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: RoleProps) => {
  const isEdit = mode === "edit";
  const [iconPanelOpen, setIconPanelOpen] = useState(false);
  const iconPanelRef = useRef<HTMLDivElement>(null);

  // -------------------------------------- HOOKS
  const { addProjectTheme, updateProjectTheme } = useActions();
  const { projectID } = globalParams();

  // icon nomi (string) dan iconList index (number) ga o'giruvchi helper
  const resolveIconIndex = (iconName: string): number => {
    const entry = iconList.find((i) => i.icon === iconName);
    return entry?.index ?? 0;
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

  // -------------------------------------- MUTATIONS
  const postMutation = useMutation({
    mutationFn: async (data: UserForm) =>
      postTheme({
        projectID: projectID!,
        data: {
          name: data.themeName,
          icon: resolveIconIndex(data.temaIcon),
        },
      }),
    onSuccess: (newTheme) => {
      if (newTheme) {
        addProjectTheme({ projectId: Number(projectID), theme: newTheme });
      }
      showToast({ type: "success" });
      close();
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });

  const putMutation = useMutation({
    mutationFn: async (data: UserForm) =>
      putTheme({
        projectID: projectID!,
        themeID: initialData!.id,
        data: {
          name: data.themeName,
          icon: resolveIconIndex(data.temaIcon),
        },
      }),
    onSuccess: (updatedTheme) => {
      if (updatedTheme) {
        updateProjectTheme({
          projectId: Number(projectID),
          theme: updatedTheme,
        });
      }
      showToast({ type: "success" });
      cancelSelection();
      close();
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });

  // -------------------------------------- FUNCTIONS
  const handleSubmitUser = async (data: UserForm) => {
    if (isEdit) {
      await putMutation.mutateAsync(data);
    } else {
      await postMutation.mutateAsync(data);
    }
  };

  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      title={isEdit ? "Редактировать темы" : "Добавление темы"}
      titleIcon={isEdit ? VscEdit : BiLayerPlus}
      buttonLabel={isEdit ? "Сохранить изменения" : "Готово"}
      onSubmit={handleSubmitUser}
      defaultValues={{
        themeName: isEdit ? initialData?.name || "" : "",
        temaIcon: isEdit
          ? (iconList.find((i) => i.index === initialData?.icon)?.icon ?? "")
          : "",
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

              {/* Add icon tugmasi */}
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
                  <div className="flex items-center gap-2 px-3! py-1.5! rounded-[20px]! border!  border-(--border-input)!">
                    <Icon as={FaPlus} fontSize={14} color="var(--main-color)" />
                    <Text fontSize="0.85em" color="var(--text-label)">
                      Добавить иконку
                    </Text>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── Icon panel (o'ngdan sliding) ── */}
            <AnimatePresence>
              {iconPanelOpen && (
                <motion.div
                  ref={iconPanelRef}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed bottom-0! left-0 w-full max-h-125! bg-(--bg-main) flex flex-col"
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
                  <div className="overflow-y-auto! max-h-400! flex-1 p-3!  ">
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

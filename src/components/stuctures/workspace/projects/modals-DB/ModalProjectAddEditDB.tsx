// import {
//   DrawerComponentBasic,
//   ModalProps,
// } from "@/components/ui/drawer/DrawerComponentBasic";
// import InputForm from "@/components/ui/input/InputForm";
// import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
// import { LocalRecord } from "@/hooks/indexed-DB/types";
// import { showToast } from "@/utils/showToaster";
// import { Controller } from "react-hook-form";
// import { LuFolderPlus } from "react-icons/lu";
// import { VscEdit } from "react-icons/vsc";

// type UserForm = {
//   nameProject: string;
// };

// interface OrganizationProjectProps extends ModalProps {
//   mode: "edit" | "add";
//   cancelSelection: () => void;
//   selectedItem?: ProjectForIndexedDB | Project | null;
//   onSuccess?: () => void;
// }

// export type ProjectForIndexedDB = LocalRecord & {
//   // local_id: number  — IDB keyPath  (LocalRecord dan keladi)
//   // id: string | null — server ID, hozircha null (LocalRecord dan keladi)
//   name: string;
//   attachment_employee: boolean;
//   auto_renewal: boolean;
//   encapsulation_tasks: boolean;
//   future_execution: boolean;
//   members: any[];
//   roles: any[];
//   statuses: any[];
//   tagsGroup: any[];
//   themes: any[];
// };

// export const ModalProjectAddEditDB = ({
//   open,
//   close,
//   mode,
//   selectedItem,
//   cancelSelection,
//   onSuccess,
// }: OrganizationProjectProps) => {
//   const isEdit = mode === "edit";
//   // =============================  HOOKS
//   const { isReady, add, edit, get } = useIndexedDB<ProjectForIndexedDB>({
//     dbName: "deviceDB",
//     storeName: "projects",
//   });
//   if (!isReady) {
//     return null;
//   }
//   // =============================  FUNCTIONS

//   const handleSubmitUser = async (data: UserForm) => {
//     const basePayload: Omit<ProjectForIndexedDB, "local_id" | "id"> = {
//       name: data.nameProject,
//       attachment_employee: false,
//       auto_renewal: false,
//       encapsulation_tasks: false,
//       future_execution: false,
//       members: [],
//       roles: [],
//       statuses: [],
//       tagsGroup: [],
//       themes: [],
//     };

//     if (isEdit) {
//       if (
//         !selectedItem ||
//         !("local_id" in selectedItem) ||
//         !selectedItem.local_id
//       ) {
//         console.warn("No selectedItem local_id for edit");
//       } else {
//         const existing = await get(selectedItem.local_id);
//         const updatedProject: ProjectForIndexedDB = {
//           ...basePayload,
//           local_id: selectedItem.local_id,
//           id: existing?.id ?? null, // mavjud server ID ni saqlaymiz
//         };
//         await edit(updatedProject);
//         onSuccess?.();
//         showToast({ type: "success" });
//         cancelSelection();
//       }
//     } else {
//       const newProject: ProjectForIndexedDB = {
//         ...basePayload,
//         local_id: Number(`101${Date.now() % 10000}`), // IDB kalit
//         id: null, // server ID — hozircha null
//       };
//       await add(newProject);
//       showToast({ type: "success" });
//       onSuccess?.();
//     }
//     close();
//   };

//   return (
//     <DrawerComponentBasic<UserForm>
//       open={open}
//       onOpenChange={close}
//       // Mode-ga qarab dinamik sarlavha va icon
//       title={isEdit ? "Редактировать проект" : "Добавить проект"}
//       titleIcon={isEdit ? VscEdit : LuFolderPlus}
//       buttonLabel={isEdit ? "Сохранить изменения" : "Создать проект"}
//       onSubmit={handleSubmitUser}
//       // Mode-ga qarab default qiymatlar
//       defaultValues={{
//         nameProject: isEdit ? selectedItem?.name || "" : "",
//       }}
//     >
//       {(form) => {
//         const { setValue, control } = form;

//         return (
//           <div className="flex flex-col gap-5! pb-20! ">
//             <Controller
//               name="nameProject"
//               control={control}
//               rules={{ required: "Напишите название проекта" }}
//               render={({ field, fieldState }) => (
//                 <InputForm
//                   maxLength={150}
//                   label="Название проекта"
//                   placeholder="Введите название"
//                   {...field}
//                   isRequired
//                   error={fieldState.error?.message}
//                   clearMethod={() => setValue("nameProject", "")}
//                 />
//               )}
//             />
//           </div>
//         );
//       }}
//     </DrawerComponentBasic>
//   );
// };

import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { LocalRecord } from "@/hooks/indexed-DB/types";
import { showToast } from "@/utils/showToaster";
import { Controller } from "react-hook-form";
import { LuFolderPlus } from "react-icons/lu";
import { VscEdit } from "react-icons/vsc";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { ProjectForIndexedDB } from "../types";
import { useTranslation } from "@/i18n/languageConfig";

type UserForm = {
  nameProject: string;
};

interface OrganizationProjectProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  selectedItem?: ProjectForIndexedDB | Project | null;
  onSuccess?: () => void;
}

export const ModalProjectAddEditDB = ({
  open,
  close,
  mode,
  selectedItem,
  cancelSelection,
  onSuccess,
}: OrganizationProjectProps) => {
  const isEdit = mode === "edit";

  // =============================  HOOKS
  const { t } = useTranslation("workspace.pages.projectsws.");
  const { payment } = useSelector((state: RootState) => state.params);
  const { isReady, add, edit, get } = useIndexedDB<ProjectForIndexedDB>({
    dbName: "deviceDB",
    storeName: "projects",
  });

  if (!isReady) return null;

  // =============================  API HANDLERS
  const handleAddAPI = async (
    payload: Omit<ProjectForIndexedDB, "local_id" | "id">,
  ) => {
    console.log("API ga qo'shish:", payload);
  };

  const handleEditAPI = async (
    id: string,
    payload: Omit<ProjectForIndexedDB, "local_id" | "id">,
  ) => {
    console.log(`API da tahrirlash (ID: ${id}):`, payload);
  };

  // =============================  IDB HANDLERS
  const handleAddIDB = async (
    payload: Omit<ProjectForIndexedDB, "local_id" | "id">,
  ) => {
    const newProject: ProjectForIndexedDB = {
      ...payload,
      local_id: Number(`101${Date.now() % 10000}`),
      id: null,
    };
    await add(newProject);
  };

  const handleEditIDB = async (
    payload: Omit<ProjectForIndexedDB, "local_id" | "id">,
  ) => {
    if (
      !selectedItem ||
      !("local_id" in selectedItem) ||
      !selectedItem.local_id
    ) {
      console.warn("No selectedItem local_id for edit");
      return;
    }
    const existing = await get(selectedItem.local_id);
    const updatedProject: ProjectForIndexedDB = {
      ...payload,
      local_id: selectedItem.local_id,
      id: existing?.id ?? null,
    };
    await edit(updatedProject);
    cancelSelection();
  };

  // =============================  MAIN SUBMIT
  const handleSubmitUser = async (data: UserForm) => {
    const basePayload: Omit<ProjectForIndexedDB, "local_id" | "id"> = {
      name: data.nameProject,
      attachment_employee: false,
      auto_renewal: false,
      encapsulation_tasks: false,
      future_execution: false,
      members: [],
      roles: [],
      statuses: [],
      tagsGroup: [],
      themes: [],
    };

    try {
      if (payment) {
        isEdit
          ? await handleEditAPI(selectedItem?.id as string, basePayload)
          : await handleAddAPI(basePayload);
      } else {
        isEdit
          ? await handleEditIDB(basePayload)
          : await handleAddIDB(basePayload);
      }

      showToast({ type: "success" });
      onSuccess?.();
      close();
    } catch (error) {
      console.error(error);
      showToast({ type: "error" });
    }
  };

  // =============================  RENDER
  return (
    <DrawerComponentBasic<UserForm>
      open={open}
      onOpenChange={close}
      title={isEdit ? t("titleEdit") : t("titleAdd")}
      titleIcon={isEdit ? VscEdit : LuFolderPlus}
      buttonLabel={isEdit ? t("btnEdit") : t("btnAdd")}
      onSubmit={handleSubmitUser}
      defaultValues={{
        nameProject: isEdit ? selectedItem?.name || "" : "",
      }}
    >
      {(form) => {
        const { setValue, control } = form;

        return (
          <div className="flex flex-col gap-5! pb-20!">
            <Controller
              name="nameProject"
              control={control}
              rules={{ required: t("errorInput.required") }}
              render={({ field, fieldState }) => (
                <InputForm
                  maxLength={150}
                  label={t("label.projectName")}
                  placeholder={t("placeholder.projectName")}
                  {...field}
                  isRequired
                  error={fieldState.error?.message}
                  clearMethod={() => setValue("nameProject", "")}
                />
              )}
            />
          </div>
        );
      }}
    </DrawerComponentBasic>
  );
};

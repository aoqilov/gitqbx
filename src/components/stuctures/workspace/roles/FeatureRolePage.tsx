import TemplateFilter from "@/components/shared/template-filter/TemplateFilter";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { FC, useState } from "react";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import { ModalRoleAddEdit } from "@/components/stuctures/workspace/roles/modals/ModalRoleAddEdit";
import { ModalRoleDelete } from "@/components/stuctures/workspace/roles/modals/ModalRoleDelete";

import ListRoleWorkspace from "./list-roles/ListRoleWorkspace";
import { useTranslation } from "@/i18n/languageConfig";

const FeatureRolePage: FC = () => {
  // --------------------------------------   HOOKS
  //
  //
  const { t } = useTranslation("workspace.pages.rolews.");

  // --------------------------------------   STATE
  //
  //
  const [searchValue, setSearchValue] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Role[]>([]);
  const [modeModal, setModeModal] = useState<"add" | "edit">("add");
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // --------------------------------------   FUNCTIONS
  function handleSubmitDelete() {
    setDeleteModal(true);
  }

  function handleSubmitAdd() {
    setModeModal("add");
    setOpenModal(true);
  }
  function handleSubmitEdit() {
    setModeModal("edit");
    setOpenModal(true);
  }
  //
  //

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
  };

  return (
    <>
      <div className="flex flex-col ">
        <div className="mt-5!">
          <TemplateHeader
            title={t("title")}
            // subText="organization"
            showBack={true}
            toBackTask={true}
          />
        </div>
        <div className="mt-4!">
          <TemplateFilter
            value={searchValue}
            onChange={setSearchValue}
            placeholder={t("placeholder.search")}
          />
        </div>
        <ScrollArea
          size={"xs"}
          orientation="vertical"
          className="max-h-[calc(100vh-200px)]! w-full mt-4!"
          isShow={false}
        >
          <ListRoleWorkspace
            searchValue={searchValue}
            isSelectionMode={isSelectionMode}
            selectedItems={selectedItems}
            setIsSelectionMode={setIsSelectionMode}
            setSelectedItems={setSelectedItems}
          />
        </ScrollArea>
      </div>
      {/* ACTION BUTTONS */}
      <TemplateButtons
        isSelectionMode={isSelectionMode}
        selectedCount={selectedItems.length}
        onAdd={() => handleSubmitAdd()}
        onEdit={() => handleSubmitEdit()}
        onDelete={() => handleSubmitDelete()}
        onClear={() => cancelSelection()}
      />
      {/* MODALS */}

      <ModalRoleAddEdit
        open={openModal}
        close={() => setOpenModal(false)}
        mode={modeModal}
        initialData={
          modeModal === "edit" && selectedItems[0]
            ? {
                id: selectedItems[0].id,
                name: selectedItems[0].name,
                permissions: selectedItems[0].permissions,
              }
            : null
        }
        cancelSelection={cancelSelection}
      />
      <ModalRoleDelete
        open={deleteModal}
        close={() => setDeleteModal(false)}
        selectedItems={selectedItems} // Tanlangan loyihalar massivi
        cancelSelection={cancelSelection}
      />
    </>
  );
};

export default FeatureRolePage;

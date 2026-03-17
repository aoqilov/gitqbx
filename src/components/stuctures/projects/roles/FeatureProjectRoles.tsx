import TemplateFilter from "@/components/shared/template-filter/TemplateFilter";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { FC, useState } from "react";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";

import { ModalProjectRoleDelete } from "@/components/stuctures/projects/roles/modals/ModalProjectRoleDelete";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ListProjectsRole from "./list-project-role/ListProjectsRole";
import { ModalProjectRoleAddEdit } from "./modals/ModalProjectRoleAddEdit";
import { useTranslation } from "@/i18n/languageConfig";

const FeatureProjectRoles: FC = () => {
  // --------------------------------------   HOOKS
  //
  //
  const { t } = useTranslation("workspace.pages.projectRole.");
  const { projectNameForHeader } = useSelector(
    (state: RootState) => state.params,
  );
  const projectRoles = useSelector((state: RootState) => state.projectRoles);

  console.log("Project Roles from Store:", projectRoles);

  // --------------------------------------   STATE
  //
  //
  const [searchValue, setSearchValue] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ProjectRole[]>([]);

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
            subText={projectNameForHeader}
            showBack={true}
          />
        </div>
        <div className="mt-4!">
          <TemplateFilter
            value={searchValue}
            onChange={setSearchValue}
            placeholder={t("placeholders.search")}
            // showFilter
            // onFilterClick={() => console.log("Filter clicked")}
          />
        </div>
        <ScrollArea
          size={"xs"}
          orientation="vertical"
          className="max-h-[calc(100vh-200px)]! w-full mt-4!"
          isShow={false}
        >
          <ListProjectsRole
            searchValue={searchValue}
            isSelectionMode={isSelectionMode}
            setIsSelectionMode={setIsSelectionMode}
            selectedItems={selectedItems}
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

      <ModalProjectRoleAddEdit
        open={openModal}
        close={() => setOpenModal(false)}
        initialData={
          modeModal === "edit" && selectedItems.length > 0
            ? selectedItems[0]
            : undefined
        }
        mode={modeModal}
        cancelSelection={cancelSelection}
      />
      <ModalProjectRoleDelete<ProjectRole>
        open={deleteModal}
        close={() => setDeleteModal(false)}
        selectedItems={selectedItems} // Tanlangan loyihalar massivi
        cancelSelection={cancelSelection}
      />
    </>
  );
};

export default FeatureProjectRoles;

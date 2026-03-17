import TemplateFilter from "@/components/shared/template-filter/TemplateFilter";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { FC, useState } from "react";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ModalProjectMemberAddEdit } from "@/components/stuctures/projects/members/modals/ModalProjectMemberAddEdit";
import { ModalProjectMemberDelete } from "@/components/stuctures/projects/members/modals/ModalProjectMemberDelete";
import ListProjectMembers from "./list-project-members/ListProjectMembers";
import { useTranslation } from "@/i18n/languageConfig";

const FeatureProjectMembersPage: FC = () => {
  // --------------------------------------   HOOKS
  //
  //
  const { t } = useTranslation("workspace.pages.projectMembers.");
  const { projectNameForHeader } = useSelector(
    (state: RootState) => state.params,
  );

  // --------------------------------------   STATE
  //
  //
  const [searchValue, setSearchValue] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Member[]>([]);

  const [modeModal, setModeModal] = useState<"add" | "edit">("add");
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // --------------------------------------   FUNCTIONS
  //
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

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
  };

  // Filter invites based on search value

  return (
    <>
      <div className="flex flex-col ">
        <div className="mt-5!">
          <TemplateHeader
            title={t("title")}
            subText={` ${projectNameForHeader}`}
            showBack={true}
          />
        </div>

        <div className="mt-4!">
          <TemplateFilter
            value={searchValue}
            onChange={setSearchValue}
            placeholder={t("placeholder.search")}
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
          <ListProjectMembers />
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

      <ModalProjectMemberAddEdit
        open={openModal}
        close={() => setOpenModal(false)}
        initialData={
          selectedItems[0]
            ? {
                id: selectedItems[0].id,
                usersMember: [],
              }
            : undefined
        } // Faqat bitta item tanlangan bo'lsa, uni edit qilish uchun yuboramiz
        mode={modeModal}
        cancelSelection={cancelSelection}
      />
      <ModalProjectMemberDelete<Member>
        open={deleteModal}
        close={() => setDeleteModal(false)}
        selectedItems={selectedItems} // Tanlangan loyihalar massivi
        cancelSelection={cancelSelection}
      />
    </>
  );
};

export default FeatureProjectMembersPage;

import TemplateFilter from "@/components/shared/template-filter/TemplateFilter";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { FC, useState } from "react";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import SegmentComponent from "@/components/ui/segment/SegmentComponent";

import { ModalMemberAddEdit } from "@/components/stuctures/workspace/members/modals/ModalMemberAddEdit";
import { ModalMemberDelete } from "@/components/stuctures/workspace/members/modals/ModalMemberDelete";
import ListCalled from "./list/ListCalled";
import ListMembers from "./list/ListMembers";
import { useTranslation } from "@/i18n/languageConfig";

const FeatureMembersPage: FC = () => {
  // --------------------------------------   HOOKS
  //
  //
  const { t } = useTranslation("workspace.pages.membersws.");

  // --------------------------------------   STATE
  //
  //
  const [searchValue, setSearchValue] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Member[]>([]);
  const [activeItem, setActiveItem] = useState<Member | null>(null);

  const [tab, setTab] = useState<"list" | "invite">("list");
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
  //

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
  };

  const optionsTitle = [
    {
      label: t("list"),
      value: "list",
    },
    { label: t("invitations"), value: "invite" },
  ];

  return (
    <>
      <div className="flex flex-col ">
        <div className="mt-5!">
          <TemplateHeader
            title={t("participants")}
            // subText="organization"
            showBack={true}
            toBackTask={true}
          />
        </div>
        <div className="mt-4!">
          <SegmentComponent
            options={optionsTitle}
            onChange={(value) => setTab(value as "list" | "invite")}
            value={tab}
            animation={false}
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
          {tab === "list" ? (
            <ListMembers
              searchValue={searchValue}
              isSelectionMode={isSelectionMode}
              selectedItems={selectedItems}
              setActiveItem={setActiveItem}
              setIsSelectionMode={setIsSelectionMode}
              setSelectedItems={setSelectedItems}
            />
          ) : (
            <ListCalled />
          )}
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

      <ModalMemberAddEdit
        open={openModal}
        close={() => setOpenModal(false)}
        initialData={selectedItems[0] ?? null}
        mode={modeModal}
        cancelSelection={cancelSelection}
      />
      <ModalMemberDelete
        open={deleteModal}
        close={() => setDeleteModal(false)}
        selectedItems={selectedItems} // Tanlangan loyihalar massivi
        cancelSelection={cancelSelection}
      />
    </>
  );
};

export default FeatureMembersPage;

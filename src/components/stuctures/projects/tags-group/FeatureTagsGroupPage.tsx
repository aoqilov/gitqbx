import TemplateFilter from "@/components/shared/template-filter/TemplateFilter";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { FC, useRef, useState } from "react";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";

import { ModalProjectTagsGroupDelete } from "@/components/stuctures/projects/tags-group/modals/ModalProjectTagsGroupDelete";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ModalProjectTagsGroupAddEdit } from "@/components/stuctures/projects/tags-group/modals/ModalProjectTagsGroupAddEdit";
import { ModalProjectTagsGroupAddEditDB } from "@/components/stuctures/projects/tags-group/modals-DB/ModalProjectTagsGroupAddEditDB";
import { ModalProjectTagsGroupDeleteDB } from "@/components/stuctures/projects/tags-group/modals-DB/ModalProjectTagsGroupDeleteDB";

import ListTagsGroup from "./list-tagsGroup/ListTagsGroup";
import ListTagsGroupDB from "./list-tagsGroup-DB/ListTagsGroupDB";

import { globalParams } from "@/utils/globalParams";
import { TagGroupForIndexedDB } from "./types";

const FeatureTagsGroupPage: FC = () => {
  // --------------------------------------   HOOKS
  const { workspaceMode, payment } = useSelector(
    (state: RootState) => state.params,
  );
  const { projectNameForHeader } = useSelector(
    (state: RootState) => state.params,
  );
  const { projectID } = globalParams();

  // --------------------------------------   STATE
  const [searchValue, setSearchValue] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // REST-API uchun
  const [selectedItems, setSelectedItems] = useState<ProjectTagGroup[]>([]);

  // IndexedDB / payment uchun (union: IDB yoki API dan kelgan raw)
  const [selectedDBItems, setSelectedDBItems] = useState<
    (TagGroupForIndexedDB | ProjectTagGroup)[]
  >([]);
  const [dbRefreshKey, setDbRefreshKey] = useState(0);

  // Modal holatlari — REST
  const [modeModal, setModeModal] = useState<"add" | "edit">("add");
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Modal holatlari — DB (IDB yoki payment=true API)
  const [modeDBModal, setModeDBModal] = useState<"add" | "edit">("add");
  const [openDBModal, setOpenDBModal] = useState(false);
  const [deleteDBModal, setDeleteDBModal] = useState(false);

  // --------------------------------------   FUNCTIONS
  // REST-API (workspaceMode !== "device" && !payment)
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

  // DB modals (workspaceMode === "device" || payment)
  function handleSubmitAddDB() {
    setModeDBModal("add");
    setOpenDBModal(true);
  }
  function handleSubmitEditDB() {
    setModeDBModal("edit");
    setOpenDBModal(true);
  }
  function handleSubmitDeleteDB() {
    setDeleteDBModal(true);
  }

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
    setSelectedDBItems([]);
  };

  // --------------------------------------   DERIVED
  // DB modals: device rejimi YOKI payment=true (API orqali DB modals ishlatiladi)
  const useDBModals = workspaceMode === "device" || payment;

  return (
    <>
      <div className="flex flex-col ">
        <div className="mt-5!">
          <TemplateHeader
            title="Группы тегов"
            subText={projectNameForHeader}
            showBack={true}
          />
        </div>
        <div className="mt-4!">
          <TemplateFilter
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search student..."
          />
        </div>
        <ScrollArea
          size={"xs"}
          orientation="vertical"
          className="max-h-[calc(100vh-200px)]! w-full mt-4!"
          isShow={false}
        >
          {workspaceMode === "device" ? (
            <ListTagsGroupDB
              projectId={Number(projectID) ?? 0}
              isSelectionMode={isSelectionMode}
              setIsSelectionMode={setIsSelectionMode}
              selectedItems={selectedDBItems}
              setSelectedItems={setSelectedDBItems}
              searchValue={searchValue}
              refreshKey={dbRefreshKey}
            />
          ) : (
            <ListTagsGroup
              searchValue={searchValue}
              isSelectionMode={isSelectionMode}
              setIsSelectionMode={setIsSelectionMode}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          )}
        </ScrollArea>
      </div>

      {/* ACTION BUTTONS */}
      {useDBModals ? (
        <TemplateButtons
          isSelectionMode={isSelectionMode}
          selectedCount={
            payment ? selectedDBItems.length : selectedDBItems.length
          }
          onAdd={() => handleSubmitAddDB()}
          onEdit={() => handleSubmitEditDB()}
          onDelete={() => handleSubmitDeleteDB()}
          onClear={() => cancelSelection()}
        />
      ) : (
        <TemplateButtons
          isSelectionMode={isSelectionMode}
          selectedCount={selectedItems.length}
          onAdd={() => handleSubmitAdd()}
          onEdit={() => handleSubmitEdit()}
          onDelete={() => handleSubmitDelete()}
          onClear={() => cancelSelection()}
        />
      )}

      {/* MODALS — REST-API (workspaceMode !== "device" && !payment) */}
      <ModalProjectTagsGroupAddEdit
        open={openModal}
        close={() => setOpenModal(false)}
        initialData={selectedItems[0]}
        mode={modeModal}
        cancelSelection={cancelSelection}
      />
      <ModalProjectTagsGroupDelete<ProjectTagGroup>
        open={deleteModal}
        close={() => setDeleteModal(false)}
        selectedItems={selectedItems}
        cancelSelection={cancelSelection}
      />

      {/* MODALS — DB (workspaceMode === "device" || payment) */}
      <ModalProjectTagsGroupAddEditDB
        open={openDBModal}
        close={() => setOpenDBModal(false)}
        initialData={selectedDBItems[0] ?? null}
        mode={modeDBModal}
        projectId={Number(projectID) ?? 0}
        cancelSelection={cancelSelection}
        onSuccess={() => setDbRefreshKey((k) => k + 1)}
      />
      <ModalProjectTagsGroupDeleteDB
        open={deleteDBModal}
        close={() => setDeleteDBModal(false)}
        selectedItems={selectedDBItems}
        cancelSelection={cancelSelection}
        onSuccess={() => setDbRefreshKey((k) => k + 1)}
      />
    </>
  );
};

export default FeatureTagsGroupPage;

import TemplateFilter from "@/components/shared/template-filter/TemplateFilter";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { FC, useRef, useState } from "react";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ModalProjectTagDelete } from "@/components/stuctures/projects/tag/modals/ModalProjectTagDelete";
import { ModalProjectTagAddEdit } from "@/components/stuctures/projects/tag/modals/ModalProjectTagAddEdit";
import { ModalProjectTagAddEditDB } from "@/components/stuctures/projects/tag/modals-DB/ModalProjectTagAddEditDB";
import { ModalProjectTagDeleteDB } from "@/components/stuctures/projects/tag/modals-DB/ModalProjectTagDeleteDB";
import ListTags from "./list-tags/ListTags";
import ListTagsDB from "./list-tags-DB/ListTagsDB";
import ListTagsDragDB, {
  ListTagsDragDBHandle,
} from "./list-tags-DB/ListTagsDragDB";
import { globalParams } from "@/utils/globalParams";
import { TagForIndexedDB } from "./types";
import { Icon } from "@chakra-ui/react";
import { PiHandTap } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";

const FeatureTagPage: FC = () => {
  // --------------------------------------   HOOKS
  const {
    workspaceMode,
    payment,
    projectNameForHeader,
    projectNameForHeader2,
  } = useSelector((state: RootState) => state.params);
  const { projectID, tagGroupID } = globalParams();

  // --------------------------------------   STATE
  const [searchValue, setSearchValue] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // REST-API uchun
  const [selectedItems, setSelectedItems] = useState<ProjectTag[]>([]);

  // DB (IDB yoki payment=true API) uchun — union type
  const [selectedDBItems, setSelectedDBItems] = useState<
    (TagForIndexedDB | ProjectTag)[]
  >([]);
  const [dbRefreshKey, setDbRefreshKey] = useState(0);

  // Modal holatlari — REST
  const [modeModal, setModeModal] = useState<"add" | "edit">("add");
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Modal holatlari — DB
  const [modeDBModal, setModeDBModal] = useState<"add" | "edit">("add");
  const [openDBModal, setOpenDBModal] = useState(false);
  const [deleteDBModal, setDeleteDBModal] = useState(false);

  // Drag ref
  const dragSaveRef = useRef<ListTagsDragDBHandle | null>(null);

  // --------------------------------------   DERIVED
  // device rejimi YOKI payment=true — DB modals ishlatiladi
  const useDBModals = workspaceMode === "device" || payment;
  // drag faqat device rejimida va payment=false bo'lganda IDB drag
  const showDragDB = workspaceMode === "device" && !payment;

  // Drag toggle state
  const [isSortableActive, setIsSortableActive] = useState(false);

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

  return (
    <>
      <div className="flex flex-col ">
        <div className="mt-5!">
          <TemplateHeader
            title="Теги"
            subText={projectNameForHeader}
            importance={projectNameForHeader2}
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

        {/* Drag toggle button — faqat device rejimida va payment=false */}
        {showDragDB && (
          <div className="flex items-center justify-end mb-2!">
            <div
              className="mt-4! flex items-center cursor-pointer select-none bg-(--main-color) rounded-[10px] p-1.5! w-fit"
              onClick={() => {
                if (isSortableActive) {
                  // Drag rejimdan chiqishda — saqlash + refresh
                  dragSaveRef.current?.saveToIndexedDB();
                  setDbRefreshKey((k) => k + 1);
                }
                setIsSortableActive((prev) => !prev);
              }}
            >
              <Icon
                as={isSortableActive ? FaCheck : PiHandTap}
                color="white"
                fontSize={"20px"}
              />
            </div>
          </div>
        )}

        <ScrollArea
          size={"xs"}
          orientation="vertical"
          className="max-h-[calc(100vh-200px)]! w-full mt-4!"
          isShow={false}
        >
          {workspaceMode === "device" ? (
            isSortableActive ? (
              /* Drag rejimi — faqat device + !payment + isSortableActive */
              <ListTagsDragDB
                saveRef={dragSaveRef}
                projectId={Number(projectID) ?? 0}
                tagGroupId={Number(tagGroupID) ?? 0}
                refreshKey={dbRefreshKey}
              />
            ) : (
              /* Normal / selection / payment rejimi */
              <ListTagsDB
                projectId={Number(projectID) ?? 0}
                tagGroupId={Number(tagGroupID) ?? 0}
                isSelectionMode={isSelectionMode}
                setIsSelectionMode={setIsSelectionMode}
                selectedItems={selectedDBItems}
                setSelectedItems={setSelectedDBItems}
                searchValue={searchValue}
                refreshKey={dbRefreshKey}
              />
            )
          ) : (
            /* REST rejimi */
            <ListTags
              searchValue={searchValue}
              setIsSelectionMode={setIsSelectionMode}
              isSelectionMode={isSelectionMode}
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
          selectedCount={selectedDBItems.length}
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

      {/* MODALS — REST-API */}
      <ModalProjectTagAddEdit
        open={openModal}
        close={() => setOpenModal(false)}
        initialData={selectedItems[0]}
        mode={modeModal}
        cancelSelection={cancelSelection}
      />
      <ModalProjectTagDelete<ProjectTag>
        open={deleteModal}
        close={() => setDeleteModal(false)}
        selectedItems={selectedItems}
        cancelSelection={cancelSelection}
      />

      {/* MODALS — DB (device || payment) */}
      <ModalProjectTagAddEditDB
        open={openDBModal}
        close={() => setOpenDBModal(false)}
        initialData={selectedDBItems[0] ?? null}
        mode={modeDBModal}
        projectId={Number(projectID) ?? 0}
        tagGroupId={Number(tagGroupID) ?? 0}
        currentCount={selectedDBItems.length}
        cancelSelection={cancelSelection}
        onSuccess={() => setDbRefreshKey((k) => k + 1)}
      />
      <ModalProjectTagDeleteDB
        open={deleteDBModal}
        close={() => setDeleteDBModal(false)}
        selectedItems={selectedDBItems}
        cancelSelection={cancelSelection}
        onSuccess={() => setDbRefreshKey((k) => k + 1)}
      />
    </>
  );
};

export default FeatureTagPage;

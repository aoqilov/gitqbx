import TemplateFilter from "@/components/shared/template-filter/TemplateFilter";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { FC, useRef, useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { ModalProjectStatusAddEdit } from "@/components/stuctures/projects/statuses/modals/ModalProjectStatusAddEdit";
import { ModalProjectStatusDelete } from "@/components/stuctures/projects/statuses/modals/ModalProjectStatusDelete";
import { Icon } from "@chakra-ui/react";

import { PiHandTap } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import ListStatus from "./list-status/ListStatus";
import ListStatusDrag, {
  ListStatusDragHandle,
} from "./list-status/ListStatusDrag";
import ListStatusDB from "./list-status-DB/ListStatusDB";
import { ModalProjectStatusDeleteDB } from "./modals-DB/ModalProjectStatusDeleteDB";
import { StatusForIndexedDB } from "./types";
import { useActions } from "@/hooks/use-actions/useActions";
import { globalParams } from "@/utils/globalParams";
import { ModalProjectStatusAddEditDB } from "./modals-DB/ModalProjectStatusAddEditDB";
import ListStatusDragDB, {
  ListStatusDragDBHandle,
} from "./list-status-DB/ListStatusDragDB";

const FeatureStatusPage: FC = () => {
  // --------------------------------------   HOOKS
  const { workspaceMode, payment } = useSelector(
    (state: RootState) => state.params,
  );
  const { projectNameForHeader } = useSelector(
    (state: RootState) => state.params,
  );
  const { projectID } = globalParams();
  const listStatusStore = useSelector(
    (state: RootState) =>
      state.projectStatuses.byProjectId[Number(projectID) ?? 0] ?? [],
  );
  const { updateProjectStatus } = useActions();

  // --------------------------------------   STATE
  const [isSortableActive, setIsSortableActive] = useState(false);
  // REST drag ref
  const dragRef = useRef<ListStatusDragHandle | null>(null);
  // IndexedDB drag ref
  const dragDBRef = useRef<ListStatusDragDBHandle | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // REST-API uchun
  const [selectedItems, setSelectedItems] = useState<ProjectStatus[]>([]);

  // IndexedDB uchun
  const [selectedDBItems, setSelectedDBItems] = useState<
    (StatusForIndexedDB | ProjectStatus)[]
  >([]);
  const [dbRefreshKey, setDbRefreshKey] = useState(0);

  const [modeModal, setModeModal] = useState<"add" | "edit">("add");
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // DB modals
  const [modeDBModal, setModeDBModal] = useState<"add" | "edit">("add");
  const [openDBModal, setOpenDBModal] = useState(false);
  const [deleteDBModal, setDeleteDBModal] = useState(false);

  // --------------------------------------   FUNCTIONS
  // REST-API
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

  // IndexedDB
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
            title="Статусы"
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
        <div className="flex items-center justify-end mb-2!">
          <div
            className="mt-4! flex items-center cursor-pointer select-none bg-(--main-color) rounded-[10px] p-1.5! w-fit"
            onClick={async () => {
              if (isSortableActive) {
                if (workspaceMode === "device") {
                  // IndexedDB — saveToIndexedDB o'zi DB ga yozadi
                  dragDBRef.current?.saveToIndexedDB();
                  setDbRefreshKey((k) => k + 1);
                } else {
                  // REST-API — Redux store ga yozamiz
                  const changes = dragRef.current?.saveToBackend();
                  if (changes && changes.length > 0) {
                    changes.forEach(({ id, priority }) => {
                      const existing = listStatusStore.find((s) => s.id === id);
                      if (existing) {
                        updateProjectStatus({
                          projectId: Number(projectID),
                          status: { ...existing, priority },
                        });
                      }
                    });
                  }
                }
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

        {isSortableActive ? (
          workspaceMode === "device" && !payment ? (
            <ListStatusDragDB
              saveRef={dragDBRef}
              projectId={Number(projectID) ?? 0}
              refreshKey={dbRefreshKey}
            />
          ) : (
            <ListStatusDrag saveRef={dragRef} dataStatus={listStatusStore} />
          )
        ) : workspaceMode === "device" ? (
          // device rejimda: payment=true → API, payment=false → IDB
          // (ListStatusDB ichida payment boshqariladi)
          <ListStatusDB
            key={dbRefreshKey}
            projectId={Number(projectID) ?? 0}
            isSelectionMode={isSelectionMode}
            selectedItems={selectedDBItems}
            setSelectedItems={setSelectedDBItems}
            setIsSelectionMode={setIsSelectionMode}
            searchValue={searchValue}
          />
        ) : (
          <ListStatus
            isSelectionMode={isSelectionMode}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            setIsSelectionMode={setIsSelectionMode}
            searchValue={searchValue}
          />
        )}
      </div>

      {/* ACTION BUTTONS — device (IDB yoki payment API) */}
      {workspaceMode === "device" && (
        <TemplateButtons
          isSelectionMode={isSelectionMode}
          selectedCount={
            payment ? selectedItems.length : selectedDBItems.length
          }
          onAdd={() => (payment ? handleSubmitAdd() : handleSubmitAddDB())}
          onEdit={() => (payment ? handleSubmitEdit() : handleSubmitEditDB())}
          onDelete={() =>
            payment ? handleSubmitDelete() : handleSubmitDeleteDB()
          }
          onClear={() => cancelSelection()}
        />
      )}

      {/* ACTION BUTTONS — REST-API (workspace rejim) */}
      {workspaceMode !== "device" && (
        <TemplateButtons
          isSelectionMode={isSelectionMode}
          selectedCount={selectedItems.length}
          onAdd={() => handleSubmitAdd()}
          onEdit={() => handleSubmitEdit()}
          onDelete={() => handleSubmitDelete()}
          onClear={() => cancelSelection()}
        />
      )}

      {/* MODALS — REST-API (workspace rejim yoki device+payment) */}
      <ModalProjectStatusAddEdit
        open={openModal}
        close={() => setOpenModal(false)}
        initialData={selectedItems[0]}
        mode={modeModal}
        cancelSelection={cancelSelection}
      />
      <ModalProjectStatusDelete<ProjectStatus>
        open={deleteModal}
        close={() => setDeleteModal(false)}
        selectedItems={selectedItems}
        cancelSelection={cancelSelection}
      />

      {/* MODALS — IndexedDB (device + !payment) */}
      <ModalProjectStatusAddEditDB
        open={openDBModal}
        close={() => setOpenDBModal(false)}
        initialData={selectedDBItems[0] ?? null}
        mode={modeDBModal}
        projectId={Number(projectID) ?? 0}
        cancelSelection={cancelSelection}
        onSuccess={() => setDbRefreshKey((k) => k + 1)}
      />
      <ModalProjectStatusDeleteDB
        open={deleteDBModal}
        close={() => setDeleteDBModal(false)}
        selectedItems={selectedDBItems}
        cancelSelection={cancelSelection}
        onSuccess={() => setDbRefreshKey((k) => k + 1)}
      />
    </>
  );
};

export default FeatureStatusPage;

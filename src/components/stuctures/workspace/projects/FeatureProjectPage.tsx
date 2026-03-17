import TemplateFilter from "@/components/shared/template-filter/TemplateFilter";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { FC, useState } from "react";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import { ModalProjecAddEdit } from "@/components/stuctures/workspace/projects/modals/ModalProjecAddEdit";
import { ModalProjectMenuSettings } from "@/components/stuctures/workspace/projects/modals/ModalProjectMenuSettings";
import { ModalProjectDelete } from "@/components/stuctures/workspace/projects/modals/ModalProjectDelete";
import { Icon, Span } from "@chakra-ui/react";
import { HiOutlineLightBulb } from "react-icons/hi";
import ProjectList from "./project-list/ProjectList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ModalProjectAddEditDB } from "./modals-DB/ModalProjectAddEditDB";
import ProjectListDB from "./project-list-DB/ProjectListDB";
import { ModalProjectDeleteDB } from "./modals-DB/ModalProjectDeleteDB";
import { ProjectForIndexedDB } from "./types";
import { useTranslation } from "@/i18n/languageConfig";

const FeatureProjectPage: FC = () => {
  // --------------------------------------   HOOKS
  //
  //
  const { t } = useTranslation("workspace.pages.projectsws.");
  const { workspaceMode } = useSelector((state: RootState) => state.params);

  // --------------------------------------  QUERIES

  // --------------------------------------   STATE
  //
  //
  const [searchValue, setSearchValue] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [activeItem, setActiveItem] = useState<Project | null>(null);

  // REST API uchun
  const [selectedItems, setSelectedItems] = useState<Project[]>([]);
  // IndexedDB uchun
  const [selectedDBItems, setSelectedDBItems] = useState<
    (ProjectForIndexedDB | Project)[]
  >([]);

  const [modeModal, setModeModal] = useState<"add" | "edit">("add");
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [menuModal, setMenuModal] = useState(false);
  //
  const [modeDB, setModeDB] = useState<"add" | "edit">("add");
  const [openDBModal, setOpenDBModal] = useState(false);
  const [deleteDBModal, setDeleteDBModal] = useState(false);
  const [dbRefreshKey, setDbRefreshKey] = useState(0);

  // --------------------------------------   FUNCTIONS
  // write to store

  function handleSubmitMenu(item: Project) {
    setActiveItem(item);
    setMenuModal(true);
  }
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
  //-----------------------------------------------INDEXED-DB
  function handleSubmitEditDB() {
    setModeDB("edit");
    setOpenDBModal(true);
  }
  function handleSubmitDeleteDB() {
    setDeleteDBModal(true);
  }
  function handleSubmitAddDB() {
    setModeDB("add");
    setOpenDBModal(true);
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
            title={t("title")}
            showBack={true}
            toBackTask={true}
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
        <div className="mt-4! py-2! pl-2! rounded-[15px] border! border-dashed border-(--main-color)! flex flex-col  gap-2!  text-left! ">
          <div className="">
            <Icon as={HiOutlineLightBulb} color={"brand.500"} />{" "}
            <Span
              className=""
              color={"var(--text-subtext)"}
              fontSize={"0.85em"}
            >
              {t("holdProject")}
            </Span>
          </div>
          <div className="">
            <Icon as={HiOutlineLightBulb} color={"brand.500"} />{" "}
            <Span
              className=""
              color={"var(--text-subtext)"}
              fontSize={"0.85em"}
            >
              {t("tapProject")}
            </Span>
          </div>
        </div>
        <ScrollArea
          size={"xs"}
          orientation="vertical"
          className="max-h-[calc(100vh-260px)]! w-full mt-4!"
          isShow={false}
        >
          {workspaceMode === "device" ? (
            <ProjectListDB
              searchValue={searchValue}
              isSelectionMode={isSelectionMode}
              setIsSelectionMode={setIsSelectionMode}
              setSelectedItems={setSelectedDBItems}
              handleSubmitMenu={(item) => {
                setActiveItem(item as unknown as Project);
                setMenuModal(true);
              }}
              selectedItems={selectedDBItems}
              refreshKey={dbRefreshKey}
            />
          ) : (
            <ProjectList
              searchValue={searchValue}
              isSelectionMode={isSelectionMode}
              setIsSelectionMode={setIsSelectionMode}
              setSelectedItems={setSelectedItems}
              handleSubmitMenu={handleSubmitMenu}
              selectedItems={selectedItems}
            />
          )}
        </ScrollArea>
      </div>
      {/* ACTION BUTTONS-INDEXED-DB ------------------------------------------ Mock indexed-DB*/}
      {workspaceMode === "device" && (
        <TemplateButtons
          isSelectionMode={isSelectionMode}
          selectedCount={selectedDBItems.length}
          onAdd={() => handleSubmitAddDB()}
          onEdit={() => handleSubmitEditDB()}
          onDelete={() => handleSubmitDeleteDB()}
          onClear={() => cancelSelection()}
        />
      )}
      <ModalProjectAddEditDB
        open={openDBModal}
        close={() => setOpenDBModal(false)}
        selectedItem={selectedDBItems[0] ?? null}
        mode={modeDB}
        cancelSelection={cancelSelection}
        onSuccess={() => setDbRefreshKey((k) => k + 1)}
      />
      <ModalProjectDeleteDB
        open={deleteDBModal}
        close={() => setDeleteDBModal(false)}
        selectedProjects={selectedDBItems}
        cancelSelection={cancelSelection}
        onSuccess={() => setDbRefreshKey((k) => k + 1)}
      />

      {/* ACTION BUTTONS ------------------------------------------ basic rest-api*/}
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
      {/* MODALS */}

      <ModalProjecAddEdit
        open={openModal}
        close={() => setOpenModal(false)}
        initialData={selectedItems[0] ?? null}
        mode={modeModal}
        cancelSelection={cancelSelection}
      />
      <ModalProjectDelete
        open={deleteModal}
        close={() => setDeleteModal(false)}
        selectedProjects={selectedItems} // Tanlangan loyihalar massivi
        cancelSelection={cancelSelection}
      />
      <ModalProjectMenuSettings
        open={menuModal}
        close={() => setMenuModal(false)}
        activeItem={activeItem}
        cancelSelection={cancelSelection}
      />
    </>
  );
};

export default FeatureProjectPage;

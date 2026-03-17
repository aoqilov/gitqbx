import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import { Box, Icon, Flex, Span } from "@chakra-ui/react";
import { LuTrash2, LuFolder } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import Text from "@/components/ui/typography/Text";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { getUID, ProjectForIndexedDB } from "../types";
import { useTranslation } from "@/i18n/languageConfig";

interface DeleteModalProps extends ModalProps {
  selectedProjects: (ProjectForIndexedDB | Project)[];
  cancelSelection: () => void;
  onSuccess?: () => void;
}

export const ModalProjectDeleteDB = ({
  open,
  close,
  selectedProjects,
  cancelSelection,
  onSuccess,
}: DeleteModalProps) => {
  const { t } = useTranslation("workspace.pages.projectsws.");
  const { remove } = useIndexedDB<ProjectForIndexedDB>({
    dbName: "deviceDB",
    storeName: "projects",
  });

  const ModalProjectDeleteDB = async () => {
    await Promise.all(selectedProjects.map((p) => remove(getUID(p) as number)));
    onSuccess?.();
    cancelSelection();
    close();
  };

  return (
    <DrawerComponentBasic
      open={open}
      onOpenChange={close}
      title={t("titleDelete")}
      titleIcon={LuTrash2}
      onSubmit={ModalProjectDeleteDB}
      buttonLabel={t("btnDelete")}
      buttonBg="error.500"
    >
      {() => (
        <Box
          mt="4"
          p="4"
          borderRadius="20px"
          borderWidth="1px"
          borderStyle={"dashed"}
          borderColor={"error.500"}
          bg="rgba(237, 123, 47, 0.05)"
        >
          <Flex align="center" gap="3" mb="4">
            <Icon as={IoWarningOutline} color="#ED7B2F" fontSize="24px" />
            <Text fontSize="0.95em" fontWeight="500">
              {t("textDelete")}{" "}
              <Span color="#ED7B2F" className="font-bold! ">
                {selectedProjects.length}
              </Span>{" "}
              {t("titleLitle")}
            </Text>
          </Flex>

          <Flex direction="column" gap="3" ml="1">
            {selectedProjects.map((project) => (
              <Flex key={getUID(project)} align="center" gap="3">
                <Icon as={LuFolder} color="gray.400" fontSize="18px" />
                <Text fontSize="0.9em" color="gray.700">
                  {project.name}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
    </DrawerComponentBasic>
  );
};

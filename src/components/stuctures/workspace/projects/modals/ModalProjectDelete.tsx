import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import { Box, Icon, Flex, Span } from "@chakra-ui/react";
import { LuTrash2, LuFolder } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import Text from "@/components/ui/typography/Text";
import { deleteProject } from "@/service/projects-route";
import { useMutation } from "@tanstack/react-query";
import { globalParams } from "@/utils/globalParams";
import { queryClient } from "@/plugin/tanstack-query/queryConfig";
import { useTranslation } from "@/i18n/languageConfig";

interface DeleteModalProps extends ModalProps {
  selectedProjects: Project[];
  cancelSelection: () => void;
}

export const ModalProjectDelete = ({
  open,
  close,
  selectedProjects,
  cancelSelection,
}: DeleteModalProps) => {
  const { t } = useTranslation("workspace.pages.projectsws.");
  const { workspaceID } = globalParams();

  const mutationDeleteProject = useMutation({
    mutationFn: (ids: number[]) =>
      Promise.all(ids.map((id) => deleteProject(workspaceID!, String(id)))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceID] });
      cancelSelection();
      close();
    },
  });

  const handleSubmitDelete = async () => {
    const ids = selectedProjects.map((p) => p.id);
    mutationDeleteProject.mutate(ids);
  };

  return (
    <DrawerComponentBasic
      open={open}
      onOpenChange={close}
      title={t("titleDelete")}
      titleIcon={LuTrash2}
      onSubmit={handleSubmitDelete}
      buttonLabel={t("btnDelete")}
      buttonBg="error.500" // To'q sariq rang
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
              <Flex key={project.id} align="center" gap="3">
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

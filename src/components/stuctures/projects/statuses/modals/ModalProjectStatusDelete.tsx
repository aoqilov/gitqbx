import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import { Box, Icon, Flex, Span } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import Text from "@/components/ui/typography/Text";
import { TbClipboardCheck } from "react-icons/tb";
import { useActions } from "@/hooks/use-actions/useActions";
import { deleteProjectStatus } from "@/service/status-route";
import { globalParams } from "@/utils/globalParams";
import { showToast } from "@/utils/showToaster";
import { useMutation } from "@tanstack/react-query";

interface DeleteModalProps<
  T extends { id: number; name: string },
> extends ModalProps {
  selectedItems: T[];
  cancelSelection: () => void;
}

export function ModalProjectStatusDelete<
  T extends { id: number; name: string },
>({ open, close, selectedItems, cancelSelection }: DeleteModalProps<T>) {
  // -------------------------------------- HOOKS
  const { removeProjectStatus } = useActions();
  const { projectID } = globalParams();

  // -------------------------------------- MUTATIONS
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        selectedItems.map((item) =>
          deleteProjectStatus({
            projectID: projectID!,
            statusID: String(item.id),
          }),
        ),
      );
    },
    onSuccess: () => {
      selectedItems.forEach((item) =>
        removeProjectStatus({
          projectId: Number(projectID),
          statusId: item.id,
        }),
      );
      showToast({ type: "success" });
      cancelSelection();
      close();
    },
    onError: () => {
      showToast({ type: "error" });
    },
  });

  const handleSubmitDelete = async () => {
    if (selectedItems.length === 0) return;
    await deleteMutation.mutateAsync();
  };

  return (
    <DrawerComponentBasic
      open={open}
      onOpenChange={close}
      title="Удаление"
      titleIcon={LuTrash2}
      onSubmit={handleSubmitDelete}
      buttonLabel="Удалить"
      buttonBg="error.500"
    >
      {() => (
        <Box
          mt="4"
          p="4"
          borderRadius="20px"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="error.500"
          bg="rgba(237, 123, 47, 0.05)"
        >
          <Flex align="center" gap="3" mb="4">
            <Icon as={IoWarningOutline} color="#ED7B2F" fontSize="24px" />
            <Text fontSize="0.95em" fontWeight="500">
              Вы уверены что хотите удалить{" "}
              <Span color="#ED7B2F" className="font-bold!">
                {selectedItems.length}
              </Span>{" "}
              элементов
            </Text>
          </Flex>

          <Flex direction="column" gap="3" ml="1">
            {selectedItems.map((item) => (
              <Flex key={item.id} align="center" gap="3">
                <Icon as={TbClipboardCheck} color="gray.400" fontSize="18px" />
                <Text fontSize="0.9em" color="gray.700">
                  {item.name}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
    </DrawerComponentBasic>
  );
}

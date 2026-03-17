import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import { Box, Icon, Flex, Span } from "@chakra-ui/react";
import { LuTrash2, LuFolder } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import Text from "@/components/ui/typography/Text";
import { useTranslation } from "@/i18n/languageConfig";

interface DeleteModalProps<T extends { id: number }> extends ModalProps {
  selectedItems: T[];
  cancelSelection: () => void;
}

export function ModalProjectMemberDelete<T extends { id: number }>({
  open,
  close,
  selectedItems,
  cancelSelection,
}: DeleteModalProps<T>) {
  const { t } = useTranslation("workspace.pages.projectMembers.");

  const handleSubmitDelete = async () => {
    const ids = selectedItems.map((p) => p.id);
    cancelSelection();
    close();
  };

  return (
    <DrawerComponentBasic
      open={open}
      onOpenChange={close}
      title={t("titleDelete")}
      titleIcon={LuTrash2}
      onSubmit={handleSubmitDelete}
      buttonLabel={t("btnDelete")}
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
              {t("deleteText")}{" "}
              <Span color="#ED7B2F" className="font-bold!">
                {selectedItems.length}
              </Span>{" "}
              {t("titleLitle")}?
            </Text>
          </Flex>

          <Flex direction="column" gap="3" ml="1">
            {selectedItems.map((item) => (
              <Flex key={item.id} align="center" gap="3">
                <Icon as={LuFolder} color="gray.400" fontSize="18px" />
                <Text fontSize="0.9em" color="gray.700">
                  {item.id}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
    </DrawerComponentBasic>
  );
}

import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import { Box, Icon, Flex, Span } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import Text from "@/components/ui/typography/Text";
import { HiHashtag } from "react-icons/hi";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { showToast } from "@/utils/showToaster";
import { TagGroupForIndexedDB, getTagGroupUID } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { deleteTagsGroupById } from "@/service/tags-group-route";
import { globalParams } from "@/utils/globalParams";

interface DeleteModalProps extends ModalProps {
  selectedItems: (TagGroupForIndexedDB | ProjectTagGroup)[];
  cancelSelection: () => void;
  onSuccess?: () => void;
}

export function ModalProjectTagsGroupDeleteDB({
  open,
  close,
  selectedItems,
  cancelSelection,
  onSuccess,
}: DeleteModalProps) {
  const { payment } = useSelector((state: RootState) => state.params);
  const { projectID } = globalParams();

  // -------------------------------------- HOOKS
  const { remove } = useIndexedDB<TagGroupForIndexedDB>({
    dbName: "deviceDB",
    storeName: "tagGroup",
  });

  // -------------------------------------- FUNCTIONS
  const handleSubmitDelete = async () => {
    if (selectedItems.length === 0) return;
    try {
      if (payment) {
        await Promise.all(
          selectedItems.map((item) =>
            deleteTagsGroupById({
              tagGroupID: Number(item.id),
              projectID: String(projectID),
            }),
          ),
        );
      } else {
        await Promise.all(
          selectedItems.map((item) => remove(getTagGroupUID(item) as number)),
        );
      }
      showToast({ type: "success" });
      onSuccess?.();
      cancelSelection();
      close();
    } catch {
      showToast({ type: "error" });
    }
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
              <Flex key={getTagGroupUID(item)} align="center" gap="3">
                <Icon as={HiHashtag} color="gray.400" fontSize="18px" />
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

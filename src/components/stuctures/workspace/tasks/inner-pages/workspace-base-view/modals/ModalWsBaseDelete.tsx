import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import { Box, Icon, Flex, Span } from "@chakra-ui/react";
import { LuTrash2, LuFolder } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import Text from "@/components/ui/typography/Text";
import { FaLayerGroup, FaMask } from "react-icons/fa";
import { TbRefreshAlert } from "react-icons/tb";

interface DeleteModalProps<
  T extends { key: string | number; name: string },
> extends ModalProps {
  selectedItems: T[];
  cancelSelection: () => void;
}

export function ModalWsBaseDelete<
  T extends { key: string | number; name: string },
>({ open, close, selectedItems, cancelSelection }: DeleteModalProps<T>) {
  const handleSubmitDelete = async () => {
    const ids = selectedItems.map((p) => p.key);
    cancelSelection();
    close();
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
              <Flex key={item.key} align="center" gap="3">
                <Icon as={TbRefreshAlert} color="gray.400" fontSize="18px" />
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

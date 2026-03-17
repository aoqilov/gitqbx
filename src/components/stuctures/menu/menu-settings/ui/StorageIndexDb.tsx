import { useTranslation } from "@/i18n/languageConfig";
import { Box, Flex, Text, HStack, Stack, Badge } from "@chakra-ui/react";

const StorageIndexDb = () => {
  const { t } = useTranslation();
  // Hisoblangan qiymatlar (keyinchalik bular IndexedDB'dan keladi)
  const stats = {
    images: 320,
    other: 114,
    free: 400,
    totalUsed: 284,
  };

  // Umumiy hajm: 784 MB
  const total = stats.images + stats.other + stats.free;

  // Foizlarni hisoblash
  const imgWidth = (stats.images / total) * 100;
  const otherWidth = (stats.other / total) * 100;
  const freeWidth = (stats.free / total) * 100;

  return (
    <div>
      <Text fontSize="0.85em" color={"var(--text-label)"} mb={2.5}>
        {t("menu.menuProfile.memoryStatus")}
      </Text>

      <Flex h="20px" w="100%" borderRadius="10px" overflow="hidden" mb={2}>
        {/* Images Segment */}
        <Flex
          w={`${imgWidth}%`}
          bg="#711CE9" // Siyohrang
          align="center"
          justify="center"
          overflow={"hidden"}
          borderRadius="10px"
        >
          <Text color="white" fontSize="0.8em">
            {stats.images} {t("menu.menuProfile.mb")}
          </Text>
        </Flex>

        {/* Other Data Segment */}
        <Flex
          w={`${otherWidth}%`}
          bg="white"
          borderY="1px solid"
          borderColor="gray.500"
          align="center"
          justify="center"
          color="black"
          fontSize="sm"
          borderRadius={"10px"}
        >
          <Text color="#000" fontSize="0.7em">
            {stats.other} {t("menu.menuProfile.mb")}
          </Text>
        </Flex>

        {/* Free Space Segment */}
        <Flex
          w={`${freeWidth}%`}
          bg="gray.500"
          align="center"
          justify="center"
          borderRadius={"10px"}
        >
          <Text color="#fff" fontSize="0.7em">
            {stats.free} {t("menu.menuProfile.mb")}
          </Text>
        </Flex>
      </Flex>

      <Flex justify="space-between" align="start">
        <Stack spacing={2}>
          <Text fontWeight="bold" fontSize="0.8em">
            {t("menu.menuProfile.totalUsed")} {stats.totalUsed}{" "}
            {t("menu.menuProfile.mb")}
          </Text>

          <HStack>
            <Box boxSize="15px" bg="#711CE9" borderRadius="4px" />
            <Text fontSize="0.8em">
              {stats.images} {t("menu.menuProfile.images")}
            </Text>
          </HStack>

          <HStack>
            <Box boxSize="15px" border="1px solid gray" borderRadius="4px" />
            <Text fontSize="0.8em">
              {stats.other} {t("menu.menuProfile.otherData")}
            </Text>
          </HStack>
        </Stack>

        <Stack align="flex-start">
          <div className=" flex gap-2">
            <Text as="span" color="#711CE9" ml={2}>
              {stats.totalUsed} мб
            </Text>
            <Text color="gray.400" fontSize={"0.8em"}>
              {t("menu.menuProfile.ofWhich")}
            </Text>
          </div>

          <HStack>
            <Box boxSize="15px" bg="gray.500" borderRadius="4px" />
            <Text fontSize="0.8em">
              {stats.free} {t("menu.menuProfile.free")}
            </Text>
          </HStack>
        </Stack>
      </Flex>
    </div>
  );
};

export default StorageIndexDb;

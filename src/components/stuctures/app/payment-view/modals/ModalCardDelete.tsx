import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import { Box, Flex, Icon, Span, Image } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import Text from "@/components/ui/typography/Text";
import { useTranslation } from "@/i18n/languageConfig";

interface DeleteModalProps<
  T extends {
    id: number;
    transferComp: string;
    cardNum: string;
    cardName: string;
  },
> extends ModalProps {
  selectedItems: T[];
  cancelSelection: () => void;
}

const getCardBg = (type: string) => {
  switch (type) {
    case "visa":
      return "linear-gradient(135deg, #06162a 0%, #0b2a4d 100%)";
    case "humo":
      return "linear-gradient(135deg, #3B7D95, #214653)";
    case "uzcard":
      return "linear-gradient(135deg, #4b6cb7, #0E4294)";
    default:
      return "linear-gradient(135deg, #2d2d2d, #4a4a4a)";
  }
};

const getCardLogo = (type: string) => {
  switch (type) {
    case "visa":
      return "/assets/images/cardVisa.png";
    case "humo":
      return "/assets/images/cardHumo.png";
    case "uzcard":
      return "/assets/images/cardUzcard.png";
    default:
      return "/assets/images/defimagecard.png";
  }
};

export function ModalCardDelete<
  T extends {
    id: number;
    transferComp: string;
    cardNum: string;
    cardName: string;
  },
>({ open, close, selectedItems, cancelSelection }: DeleteModalProps<T>) {
  // ------------------------------------------------------- HOOKS
  const { t } = useTranslation("workspace.pages.payment.");

  // ------------------------------------------------------- FUNCTIONS
  const handleSubmitDelete = async () => {
    console.log(
      "DELETE:",
      selectedItems.map((c) => c.id),
    );
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
        <Box mt="4">
          {/* Предупреждение */}
          <Flex
            align="center"
            gap="2"
            mb="4"
            p="3"
            borderRadius="14px"
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="error.500"
            bg="rgba(237, 123, 47, 0.05)"
          >
            <Icon
              as={IoWarningOutline}
              color="#ED7B2F"
              fontSize="20px"
              flexShrink={0}
            />
            <Text fontSize="0.9em" fontWeight="500">
              {t("deleteText")}{" "}
              <Span color="#ED7B2F" className="font-bold!">
                {selectedItems.length}
              </Span>
            </Text>
          </Flex>

          {/* Карточки */}
          <Flex direction="column" gap="3">
            {selectedItems.map((card) => (
              <Box
                key={card.id}
                borderRadius="16px"
                p="16px"
                background={getCardBg(card.transferComp)}
                color="white"
                display="flex"
                alignItems="center"
                gap="4"
              >
                {/* Логотип карты */}
                <Box flexShrink={0} w="56px">
                  <Image
                    src={getCardLogo(card.transferComp)}
                    alt={card.transferComp}
                    w="56px"
                    h={"36px"}
                    objectFit="contain"
                  />
                </Box>

                {/* Название + номер */}
                <Flex direction="column" gap="0.5">
                  <Text fontSize="1em" fontWeight="600" color="white">
                    {card.cardName}
                  </Text>
                  <Text fontSize="0.82em" color="rgba(255,255,255,0.65)">
                    {card.cardNum}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    </DrawerComponentBasic>
  );
}

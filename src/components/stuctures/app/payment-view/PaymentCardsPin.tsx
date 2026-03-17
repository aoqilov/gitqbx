import { useRef, useState } from "react";
import { Box, Text, Flex, VStack, Heading } from "@chakra-ui/react";
import Image from "@/components/ui/image/Image";
import Checkbox from "@/components/ui/checkbox/Checkbox";
import { motion, AnimatePresence } from "framer-motion";
import TemplateButtons from "@/components/shared/template-buttons/TemplateButtons";
import { set } from "zod";
import { ModalCardAddEdit } from "./modals/ModalCardAddEdit";
import { ModalCardDelete } from "./modals/ModalCardDelete";
import { TypeListUser } from "@/views/project-pages/routines-view/RoutineView";

type CardItem = {
  key: string;
  id: number;
  transferComp: string;
  cardNum: string;
  cardName: string;
  cardDate: string;
  cardUsername: string;
  bgColor: string;
};

const cardsData: CardItem[] = [
  {
    key: "card-1",
    id: 1,
    transferComp: "visa",
    cardNum: "9860 **** **** 6301",
    cardName: "Основная карта",
    cardDate: "12/30",
    cardUsername: "Shakirov Sukhrob",
    bgColor: "linear-gradient(135deg, #06162a 0%, #0b2a4d 100%)",
  },
  {
    key: "card-2",
    id: 2,
    transferComp: "humo",
    cardNum: "9860 **** **** 1122",
    cardName: "Xarajatlar uchun",
    cardDate: "05/28",
    cardUsername: "Shakirov Sukhrob",
    bgColor: "linear-gradient(135deg, #1d976c, #93f9b9)",
  },
  {
    key: "card-3",
    id: 3,
    transferComp: "uzcard",
    cardNum: "8600 **** **** 4455",
    cardName: "Jamg'arma",
    cardDate: "08/27",
    cardUsername: "Shakirov Sukhrob",
    bgColor: "linear-gradient(135deg, #4b6cb7, #182848)",
  },
];

interface PaymentCardsPinProps {
  onSelectionChange?: (selectedCards: CardItem[]) => void;
}

const PaymentCardsPin = ({ onSelectionChange }: PaymentCardsPinProps) => {
  // ----------------------------------  STATE
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CardItem[]>([]);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const CHECKBOX_WIDTH = 40; // px — checkbox uchun ajratilgan joy

  // ----------------------------------  FUNCTIONS
  function handleSubmitAdd() {
    setModalAdd(true);
  }

  function handleSubmitDelete() {
    setModalDelete(true);
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
        return "gray";
    }
  };

  // Uzun bosish boshlanishi → selection mode yoqiladi
  const handlePressStart = (card: CardItem) => {
    pressTimer.current = setTimeout(() => {
      setIsSelectionMode(true);
      const newSelected = [card];
      setSelectedItems(newSelected);
      onSelectionChange?.(newSelected);
    }, 800);
  };

  // Uzun bosish tugashi
  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // Checkbox toggle
  const handleCheckboxChange = (card: CardItem) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((s) => s.id === card.id);
      let newItems: CardItem[];

      if (isSelected) {
        newItems = prev.filter((s) => s.id !== card.id);
        if (newItems.length === 0) {
          setIsSelectionMode(false);
        }
      } else {
        newItems = [...prev, card];
      }

      onSelectionChange?.(newItems);
      return newItems;
    });
  };

  // Selection mode ni bekor qilish
  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
    onSelectionChange?.([]);
  };

  const isSelected = (card: CardItem) =>
    selectedItems.some((s) => s.id === card.id);

  return (
    <div className="flex flex-col gap-2.5">
      {cardsData.map((card) => (
        <div
          key={card.id}
          className="relative flex items-center overflow-hidden"
        >
          {/* Checkbox — chap tomondan animatsiya bilan chiqadi */}
          <AnimatePresence>
            {isSelectionMode && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ width: CHECKBOX_WIDTH, flexShrink: 0 }}
                className="absolute left-0 z-10 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(card);
                }}
              >
                <Checkbox
                  checked={isSelected(card)}
                  onCheckedChange={() => handleCheckboxChange(card)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Karta — isSelectionMode da o'ngga siljiydi, kengligi dinamik kamayadi */}
          <motion.div
            style={{ width: "100%" }}
            animate={{
              x: isSelectionMode ? CHECKBOX_WIDTH : 0,
              width: isSelectionMode
                ? `calc(100% - ${CHECKBOX_WIDTH}px)`
                : "100%",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Box
              height="210px"
              borderRadius="24px"
              p="24px"
              color="white"
              background={getCardBg(card.transferComp)}
              position="relative"
              boxShadow="2xl"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              transition="box-shadow 0.2s"
              cursor="pointer"
              onMouseDown={() => handlePressStart(card)}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={() => handlePressStart(card)}
              onTouchEnd={handlePressEnd}
              onClick={() => {
                if (isSelectionMode) {
                  handleCheckboxChange(card);
                }
              }}
            >
              {/* Yuqori qism: Logo va Karta raqami */}
              <Flex justify="space-between" align="center">
                <Box>
                  <Image
                    src={`/assets/images/${
                      card.transferComp === "visa"
                        ? "cardVisa.png"
                        : card.transferComp === "humo"
                          ? "cardHumo.png"
                          : "cardUzcard.png"
                    }`}
                    alt="cardlogo"
                    className=""
                  />
                </Box>
                <Text fontSize="18px" fontWeight="400" fontFamily="monospace">
                  {card.cardNum}
                </Text>
              </Flex>

              {/* Markaz: Karta nomi */}
              <VStack align="start" marginTop={"25px"}>
                <Text fontSize="12px" color="rgba(255,255,255,0.7)">
                  Наименование карты
                </Text>
                <Heading size="md" fontWeight="600" fontSize="1.42em">
                  {card.cardName}
                </Heading>
              </VStack>

              {/* Pastki qism: Ism va Muddat */}
              <Flex justify="space-between" align="flex-end">
                <Text fontSize="1.15em" fontWeight="400" opacity="0.9">
                  {card.cardUsername}
                </Text>
                <VStack align="end">
                  <Text fontSize="0.9em" color="rgba(255,255,255,0.7)">
                    Срок действия
                  </Text>
                  <Text fontSize="1em" fontWeight="600">
                    {card.cardDate}
                  </Text>
                </VStack>
              </Flex>
            </Box>
          </motion.div>
        </div>
      ))}

      {/* Selection mode — bekor qilish tugmasi */}
      <TemplateButtons
        isSelectionMode={isSelectionMode}
        selectedCount={selectedItems.length}
        onAdd={() => handleSubmitAdd()}
        onDelete={() => handleSubmitDelete()}
        onClear={() => cancelSelection()}
        showEdit={false}
      />
      <ModalCardAddEdit
        open={modalAdd}
        close={() => setModalAdd(false)}
        initialData={selectedItems[0]}
        mode={"add"}
        cancelSelection={cancelSelection}
      />
      <ModalCardDelete
        open={modalDelete}
        close={() => setModalDelete(false)}
        selectedItems={selectedItems} // Tanlangan loyihalar massivi
        cancelSelection={cancelSelection}
      />
    </div>
  );
};

export default PaymentCardsPin;

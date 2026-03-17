import PageLayout from "@/components/layouts/page-layout/PageLayout";
import Button from "@/components/ui/buttons/Button";
import Image from "@/components/ui/image/Image";
import { useColorMode } from "@/components/ui/provider/color-mode";
import Separator from "@/components/ui/separator/Separator";
import Subtext from "@/components/ui/typography/SubText";
import Text from "@/components/ui/typography/Text";
import { Icon, Span } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdHourglassEmpty, MdOutlineKeyboardBackspace } from "react-icons/md";

import { GiSandsOfTime } from "react-icons/gi";
import { IoEyeOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import { LiaHourglassSolid } from "react-icons/lia";

const PaymentLoading = () => {
  // ----------------------------  HOOKS
  const { colorMode } = useColorMode();
  // ----------------------------  STATES
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // ----------------------------  FUNCTIONS
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonDisabled(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const MotionDiv = motion.div;
  const MotionIcon = motion(Icon);
  return (
    <>
      <PageLayout>
        <div className="flex flex-col h-[calc(100vh-90px)]!   justify-between  ">
          <div className="mt-5!">
            <TemplateHeader title="Статус платежа" showBack={true} />
          </div>
          <div className="p-1! min-h-[300px]! flex flex-col items-center justify-center">
            <div className="text-center  w-[163px]! h-[163px]! relative ">
              <Image
                src={
                  colorMode === "light"
                    ? "/assets/images/starkLoad.png"
                    : "/assets/images/starDark.png"
                }
                alt="loadback"
                className="w-[163px]! h-[163px]! "
              />
              <MotionDiv
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  rotate: [0, 360, 360, 720, 720],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ display: "inline-block" }}
              >
                <Icon as={MdHourglassEmpty} fontSize={45} color="white" />
              </MotionDiv>
              {/* <MotionDiv
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2, // 1 to‘liq aylanish vaqti (aniq)
                  ease: "linear", // tezlik o‘zgarmaydi
                  repeat: Infinity, // doimiy
                }}
                style={{ display: "inline-block" }}
              >
                <Icon as={MdHourglassEmpty} fontSize={45} color="white" />
              </MotionDiv> */}
            </div>
            <div className="mt-17! px-3! py-1.5! bg-[#5252521A] rounded-[25px]!">
              <Text fontSize={"1em"}>Платеж обрабатывается...</Text>
            </div>
            <div className="mt-8! w-[90%]! text-center">
              <Text fontSize={"1em"} className="font-[500]!">
                {" "}
                Ваш платеж обрабатывается. Если у вас есть вопросы, не
                стесняйтесь обращаться в нашу службу поддержки!
              </Text>
              <Subtext className="mt-5!">
                <Span color={"brand.500"} lineHeight={"short"}>
                  В окне статуса платежа
                </Span>{" "}
                вы можете в любое время проверить текущее состояние вашего
                платежа
              </Subtext>
            </div>
          </div>
          <div className="p-1! gap-3 flex flex-col">
            <Button
              type="submit"
              variant="solid"
              bg={"brand.500"}
              disabled={!isButtonDisabled}
            >
              <Icon color="white" as={IoEyeOutline} />
              <Text color={colorMode === "light" ? "white" : "white"}>
                Проверить платёж
              </Text>
            </Button>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default PaymentLoading;

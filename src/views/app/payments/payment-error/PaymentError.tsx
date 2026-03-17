import PageLayout from "@/components/layouts/page-layout/PageLayout";
import Button from "@/components/ui/buttons/Button";
import { useColorMode } from "@/components/ui/provider/color-mode";
import Separator from "@/components/ui/separator/Separator";
import Subtext from "@/components/ui/typography/SubText";
import Text from "@/components/ui/typography/Text";
import { Icon, Span } from "@chakra-ui/react";
import React from "react";
import { MdHourglassEmpty, MdOutlineKeyboardBackspace } from "react-icons/md";

import { GiSandsOfTime } from "react-icons/gi";
import { IoClose, IoEyeOutline, IoReloadOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import { LiaHourglassSolid } from "react-icons/lia";
import Image from "@/components/ui/image/Image";

const PaymentError = () => {
  // ----------------------------  HOOKS
  const { colorMode } = useColorMode();
  // ----------------------------  STATES

  // ----------------------------  FUNCTIONS
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
                src="/public/assets/images/errorloadback.png"
                alt="loadback"
                className="w-[163px]! h-[163px]! "
              />
              <MotionDiv
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                // animate={{
                //   rotate: [0, 360, 360, 720, 720],
                // }}
                // transition={{
                //   duration: 3,
                //   times: [0, 0.1, 0.25, 0.4, 0.5],
                //   repeat: Infinity,
                //   ease: "linear",
                // }}
                // style={{ display: "inline-block" }}
              >
                <Icon as={IoClose} fontSize={75} color="error.500" />
              </MotionDiv>
            </div>
            <div className="mt-17! px-3! py-1.5! bg-[#EC711F1A] rounded-[25px]!">
              <Text fontSize={"1em"} color={"#EC711F"}>
                Платеж не прошел(
              </Text>
            </div>
            <div className="mt-8! w-[90%]! text-center">
              <Text fontSize={"1em"} className="font-[500]!">
                {" "}
                К сожалению, ваша оплата не прошла. Пожалуйста, свяжитесь с
                нашей службой поддержки, и мы поможем вам решить эту проблему.
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
            <Button type="submit" variant="solid" bg={"error.500"}>
              <Icon color="white" as={IoReloadOutline} />
              <Text color={colorMode === "light" ? "white" : "white"}>
                Повторить инвойс
              </Text>
            </Button>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default PaymentError;

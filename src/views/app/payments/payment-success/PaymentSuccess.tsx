import PageLayout from "@/components/layouts/page-layout/PageLayout";
import Button from "@/components/ui/buttons/Button";
import { useColorMode } from "@/components/ui/provider/color-mode";
import Subtext from "@/components/ui/typography/SubText";
import Text from "@/components/ui/typography/Text";
import { Icon, Image, Span } from "@chakra-ui/react";
import { IoReloadOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import { FaCheck, FaStar } from "react-icons/fa";
import { useMemo } from "react";

const PaymentSuccess = () => {
  // ----------------------------  HOOKS
  const { colorMode } = useColorMode();
  // ----------------------------  STATES

  // ----------------------------  FUNCTIONS
  const motionItems = [
    { x: 0, y: 150, rotate: "0deg" },
    { x: 0, y: -150, rotate: "180deg" },
    { x: -150, y: 0, rotate: "90deg" },
    { x: 150, y: 0, rotate: "-90deg" },
    { x: 120, y: -120, rotate: "-135deg" },
    { x: -120, y: -120, rotate: "135deg" },
    { x: -120, y: 120, rotate: "45deg" },
    { x: 120, y: 120, rotate: "-45deg" },
  ];
  const motionItemsStar = [
    { distance: 140, angle: 110 },
    { distance: 160, angle: 40 },
    { distance: 180, angle: 80 },
    { distance: 170, angle: 130 },
    { distance: 150, angle: 180 },
    { distance: 170, angle: 220 },
    { distance: 180, angle: 260 },
    { distance: 160, angle: 300 },
    { distance: 120, angle: 350 },

    { distance: 130, angle: 220 },
    { distance: 130, angle: 100 },
    { distance: 140, angle: 300 },
    { distance: 110, angle: 140 },
  ];

  function hexToRgb(hex: string) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // RGB → HEX
  function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Tasodifiy rang yaratish
  function randomColorBetween(startHex: string, endHex: string) {
    const start = hexToRgb(startHex);
    const end = hexToRgb(endHex);
    const r = Math.floor(start.r + Math.random() * (end.r - start.r));
    const g = Math.floor(start.g + Math.random() * (end.g - start.g));
    const b = Math.floor(start.b + Math.random() * (end.b - start.b));
    return rgbToHex({ r, g, b });
  }

  // ⭐ Random qiymatlarni faqat 1 marta yaratamiz
  const stars = useMemo(() => {
    return motionItemsStar.map((item) => {
      const rad = (item.angle * Math.PI) / 180;

      return {
        x: Math.cos(rad) * item.distance,
        y: Math.sin(rad) * item.distance,
        delay: Math.random() * 0.4,
        opacity: Math.random() * 0.5 + 0.5,
        size: Math.random() * 7 + 9,
        scale: [0.5, 1.2, 1],
        color: randomColorBetween("#8259FF", "#711CE9"),
      };
    });
  }, []);
  const MotionDiv = motion.div;
  return (
    <>
      <PageLayout>
        <div className="flex flex-col h-[calc(100vh-90px)]!   justify-between  ">
          <div className="mt-5! z-10">
            <TemplateHeader title="Статус платежа" showBack={true} />
          </div>
          <div className="p-1! min-h-[300px]! flex flex-col items-center justify-center ">
            <div className=" w-full! h-[350px]! relative ">
              <MotionDiv
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",

                  borderRadius: "50%",
                  zIndex: 2,
                }}
                initial={{ x: "-50%", y: "-50%" }}
                animate={{ scale: [0.4, 1.4, 1] }}
                transition={{
                  duration: 1,
                  ease: "easeInOut", // bu silliq animatsiya beradi
                  // yoki spring bilan
                  damping: 20,
                }}
              >
                <Image
                  src="/public/assets/images/Star.png"
                  alt="Star"
                  className="w-[163px]! h-[163px]!"
                />
                <Icon
                  as={FaCheck}
                  color={"white"}
                  fontSize={50}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              </MotionDiv>

              {motionItems.map((item, index) => (
                <MotionDiv
                  key={index}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  animate={{
                    x: item.x,
                    y: item.y,
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    top: "10%",
                    left: "40%",
                    transform: "translate(-50%, -50%)",
                    width: "90px",
                    height: "260px",
                    background: `linear-gradient(to top,
        ${colorMode === "light" ? "#fff, #EDE7FF" : "#000, #51476E"}
      )`,
                    clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)",
                    rotate: item.rotate,
                  }}
                />
              ))}
              {stars.map((star, index) => (
                <MotionDiv
                  key={index}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  animate={{
                    x: star.x,
                    y: star.y,
                    opacity: star.opacity,
                    scale: star.scale,
                  }}
                  transition={{
                    duration: 1,
                    delay: star.delay,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    willChange: "transform, opacity",
                  }}
                >
                  <Icon as={FaStar} color={star.color} fontSize={star.size} />
                </MotionDiv>
              ))}
            </div>
            <div className="mt-5! px-3! py-1.5! bg-[#7142ff14] rounded-[25px]! z-10">
              <Text fontSize={"1em"} color={"brand.500"}>
                Успешено !
              </Text>
            </div>
            <div className="mt-3! w-[90%]! text-center z-20">
              <Text fontSize={"1em"} className="font-[500]!">
                {" "}
                Благодарим вас за использование нашего приложения. Если у вас
                возникнут вопросы, наша служба поддержки всегда готова помочь.
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
            <Button type="submit" variant="solid" bg={"brand.500"}>
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

export default PaymentSuccess;

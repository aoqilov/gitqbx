import Image from "@/components/ui/image/Image";
import Subtext from "@/components/ui/typography/SubText";
import Text from "@/components/ui/typography/Text";
import { FC, useState } from "react";
import {
  AiFillStar,
  AiOutlineCloudSync,
  AiOutlineCrown,
  AiOutlineThunderbolt,
} from "react-icons/ai";
import { TbDiamond, TbHours24 } from "react-icons/tb";
import {
  MdOutlineBackup,
  MdOutlineCloudSync,
  MdOutlineSecurity,
} from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCoverflow } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Button from "@/components/ui/buttons/Button";
import { useColorMode } from "@/components/ui/provider/color-mode";
import { Icon, Span } from "@chakra-ui/react";
import "./offerView.css";
import PageLayout from "@/components/layouts/page-layout/PageLayout";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/languageConfig";

const OfferView: FC = () => {
  // ---------------------------------- HOOK
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { t } = useTranslation("workspace.pages.offer.");

  const paymentVariants = [
    {
      popularText: t("servicename.sync"),
      icon: AiOutlineCrown,

      id: "sync",
      mainTitle: t("mainTitle.sync"),
      paragraph: t("paragraph.sync"),
      description: t("description.sync"),
      sumFree: 12,
      sumActive: 10,
      adventages: [
        {
          icon: <MdOutlineCloudSync />,
          text: t("adventages.sync.text1"),
        },
        {
          icon: <TbHours24 />,
          text: t("adventages.sync.text2"),
        },
      ],
    },

    {
      popularText: t("servicename.backup"),
      icon: AiOutlineCrown,
      id: "backup",
      mainTitle: t("mainTitle.backup"),
      paragraph: t("paragraph.backup"),
      description: t("description.backup"),
      sumFree: 8,
      sumActive: 6,
      adventages: [
        {
          icon: <MdOutlineBackup />,
          text: t("adventages.backup.text1"),
        },
        {
          icon: <MdOutlineSecurity />,
          text: t("adventages.backup.text2"),
        },
        {
          icon: <TbHours24 />,
          text: t("adventages.backup.text3"),
        },
      ],
    },

    {
      popularText: t("servicename.premium"),
      icon: TbDiamond,
      id: "premium",
      mainTitle: t("mainTitle.premium"),
      paragraph: t("paragraph.premium"),
      description: t("description.premium"),
      sumFree: 20,
      sumActive: 15,
      adventages: [
        {
          icon: <AiFillStar />,
          text: t("adventages.premium.text1"),
        },
        {
          icon: <MdOutlineCloudSync />,
          text: t("adventages.premium.text2"),
        },
        {
          icon: <AiOutlineThunderbolt />,
          text: t("adventages.premium.text3"),
        },
      ],
    },
  ];

  // ---------------------------------- STATE
  const [activeIndex, setActiveIndex] = useState(1);
  // ---------------------------------- FUNCTION
  const activeOffer = paymentVariants[activeIndex];

  return (
    <PageLayout>
      <div className="w-full h-[calc(100vh-100px)]!  flex flex-col   ">
        <div>
          <TemplateHeader title={t("title")} showBack={true} />
        </div>
        <div className=" mt-5! ">
          <Swiper
            initialSlide={activeIndex}
            modules={[EffectCoverflow, Pagination]}
            effect="coverflow"
            centeredSlides
            slidesPerView={1} // 🔑 yonlari ko‘rinishi uchun
            spaceBetween={30}
            pagination={{
              clickable: true,
              renderBullet: (index, className) => {
                // har bir bulletga class qo‘shamiz
                return `<span  class=" ${className}"></span>`;
              },
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 120, // 🔑 markazdan chiqish chuqurligi
              modifier: 1,
              slideShadows: false,
            }}
            className="offerSwiper "
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {paymentVariants.map((item) => (
              <SwiperSlide key={item.id}>
                {({ isActive }) => (
                  <div className="pb-10!">
                    <div className=" px-4! py-6!  rounded-[20px]! shadow-[5px_10px_40px_0px_#711CE926] border-[1px]! border-[var(--main-color)]! ">
                      {/*  */}
                      <div className="mt-6! flex flex-col items-center ">
                        <Image
                          src="/public/assets/images/logo-brand.png"
                          alt="logo"
                          className="w-[112px]!"
                        />
                        <Subtext className="">{item.mainTitle}</Subtext>
                      </div>
                      {/*  */}
                      <div className="flex justify-between items-center mt-5!">
                        <div className="flex items-baseline gap-2">
                          <Text
                            fontSize={"2.85em"}
                            color={"brand.500"}
                            className="font-[600]!"
                          >
                            ${item.sumActive}
                          </Text>
                          <Span color={"#A4A4A4"} fontSize={"0.9em"}>
                            <span className="line-through">{item.sumFree}</span>{" "}
                            {t("month")}
                          </Span>
                        </div>
                        <div className="bg-green-200 px-2! py-1! flex items-center gap-1! rounded-[35px]! bg-[var(--main-color)]!">
                          <Span>{item.popularText}</Span>
                          <Icon
                            color="white"
                            fontSize="1.5rem"
                            as={item.icon}
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="mt-2.5! flex flex-col gap-0.5! ">
                        <div className=" flex gap-2">
                          <Icon
                            as={AiOutlineCloudSync}
                            color={"var(--main-color)"}
                            fontSize={20}
                          />
                          <Text fontSize={"1em"} color={"brand.500"}>
                            Sync
                          </Text>
                        </div>
                        <Subtext>
                          Мгновенный доступ к задачам с разных устройств
                        </Subtext>
                      </div>
                      {/*  */}
                      <div>
                        <Text
                          fontSize={"1em"}
                          color={"brand.500"}
                          className="mt-5! font-medium!"
                        >
                          {t("serviceNameText")}
                        </Text>
                        <Subtext>{t("personalAccess")}</Subtext>
                      </div>
                      {/*  */}
                      <div>
                        <Text
                          fontSize={"1em"}
                          color={"brand.500"}
                          className="mt-5! font-medium!"
                        >
                          {t("subscriptionBenefits")}
                        </Text>
                        <div className="mt-2.5! flex flex-col gap-2.5! bg-[#711CE926] rounded-[15px]! p-4! overflow-y-scroll h-35!">
                          {item.adventages.map((adv, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2!"
                            >
                              <Icon color={"var(--main-color)"}>
                                {adv.icon}
                              </Icon>
                              <Text fontSize={"1em"}>{adv.text}</Text>1
                            </div>
                          ))}
                        </div>
                        <div>
                          <Button
                            variant="solid"
                            bg={"brand.500"}
                            className="mt-2!"
                          >
                            {t("learnMore")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className=" mt-10! flex flex-col gap-3.75! pt-1! pb-10!">
          <Button
            variant="outline"
            borderColor="var(--main-color)"
            onClick={() => navigate("/app/payments")}
          >
            <Text color={colorMode == "light" ? "brand.500" : "white"}>
              {t("subscribeFor")}{" "}
              <span className="text-gray-400 text-[14px] line-through mx-1!">
                {activeOffer.sumFree}
              </span>{" "}
              <span className="font-bold! mr-1!">{activeOffer.sumActive}</span>${" "}
              {t("month")}
            </Text>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default OfferView;

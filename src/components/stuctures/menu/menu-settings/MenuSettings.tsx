import Avatar from "@/components/ui/avatar/Avatar";
import {
  ColorModeButton,
  useColorMode,
} from "@/components/ui/provider/color-mode";
import Heading from "@/components/ui/typography/Heading";
import Subtext from "@/components/ui/typography/SubText";
import React, { useEffect, useState } from "react";
import DegreeCount from "../ui/DegreeCount";
import Separator from "@/components/ui/separator/Separator";
import { Icon, Image } from "@chakra-ui/react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Text from "@/components/ui/typography/Text";
import { FaRegUserCircle } from "react-icons/fa";

import { Controller, useForm } from "react-hook-form";
import { FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import RangeSlider from "@/components/ui/slider/RangeSlider";
import StorageIndexDb from "./ui/StorageIndexDb";
import { setMenuMode } from "@/store/params/params.slice";
import { SelectCompoent } from "@/components/ui/select/SelectCompoent";
import { useTranslation } from "@/i18n/languageConfig";

type PropsPage = {
  closeDrawer: () => void;
};

type TypeFormSettings = {
  language: string;
  theme: string;
  sizeText: string;
  dataClearDay: string;
};

const MenuSettings = ({ closeDrawer }: PropsPage) => {
  // -----------------------------------------------  HOOKS
  const { colorMode, setColorMode } = useColorMode();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { t, lang, changeLanguage } = useTranslation();

  // -----------------------------------------------  STATES
  const themeOptions = [
    {
      value: "light",
      label: t("menu.menuProfile.themeModeLight"),
    },
    {
      value: "dark",
      label: t("menu.menuProfile.themeModeDark"),
    },
  ];

  const languageOptions = [
    {
      value: "uz",
      label: "O‘zbekcha",
      image: "/assets/images/flag-uzb.jpg",
    },
    {
      value: "ru",
      label: "Русский",
      image: "/assets/images/flag-rus.jpeg",
    },
    {
      value: "kr",
      label: "Узбекча",
      image: "/assets/images/flag-uzb.jpg",
    },
  ];
  const STORAGE_FONTSIZE = "font-size";
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_FONTSIZE);
    return saved ? Number(saved) : 14;
  });
  const [isShort, setIsShort] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TypeFormSettings>({
    defaultValues: {
      language: lang,
      theme: "light",
      sizeText: "14",
      dataClearDay: "",
    },
  });
  const selectedLanguage = watch("language");
  useEffect(() => {
    if (selectedLanguage) {
      changeLanguage(selectedLanguage as "ru" | "uz");
    }
  }, [selectedLanguage]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--base-font-size",
      `${fontSize}px`,
    );
    localStorage.setItem(STORAGE_FONTSIZE, String(fontSize));
  }, [fontSize]);

  // ----------------------------------------------- FUNCTIONS
  const handleChange = (val: number[]) => {
    setFontSize(val[0]);
  };
  const onSubmit = (data: any) => {
    // console.log("Form Submitted:", data);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          key={colorMode} // MUHIM
          className="h-full"
        >
          <div className="relative h-full! bg-[var(--bg-main)]">
            {/* top image */}
            <div
              className={`w-full relative transition-all duration-500 ease-in-out h-[205px]`}
            >
              <Image
                className="w-full h-full! rounded-b-[30px]!"
                src="/assets/images/menuBackImage.png"
                alt="menubackimg"
                objectFit=""
              />
              <div
                className="absolute bottom-[20%] left-8 z-20 p-0.5! bg-[#711ce9b8] rounded-full cursor-pointer"
                onClick={() => {
                  dispatch(setMenuMode("default"));
                }}
              >
                <Icon as={MdKeyboardBackspace} color={"#fff"} fontSize={25} />
              </div>
              <div
                className=" z-20! absolute right-8 bottom-[20%] bg-[#711ce9b8] rounded-full p-1! "
                onClick={() => {
                  closeDrawer();
                }}
              >
                <Icon fontSize={20} color={"#fff"} as={FaXmark} />
              </div>
            </div>
            {/* main user */}
            <div
              className={`min-h-[400px] max-w-[90%] mx-auto! relative bottom-[30px] rounded-[20px] shadow-md pt-[120px]! pb-[20px]! bg-[var(--bg-sidebar-second)]`}
            >
              {/* user-info */}
              <div className="w-full absolute left-[50%] top-[-50px] -translate-x-1/2 text-center">
                <Avatar
                  size="size100"
                  ring="ringWhite"
                  fullName={"menuUser"}
                  avatar={user.user.telegram_avatar}
                />
                <Heading className="text-[15px]! mt-[20px]!">
                  {user.user.fullname}
                </Heading>
                <Subtext className="mt-0.5!">
                  {user.user.telegram_username}
                </Subtext>
                <div className="absolute right-4 top-[50%]! w-[30px] h-[30px]">
                  <ColorModeButton />
                </div>
                <div className="absolute left-4 top-[50%]!">
                  <div className="w-[30px] h-[30px]">
                    <DegreeCount
                      percent={47}
                      size={32}
                      color="var(--main-color)"
                    />
                  </div>
                </div>
              </div>
              <Separator
                size="md"
                variant="solid"
                className="w-[90%]! mx-auto!"
              />

              {/* MAIN-SECTION */}
              <div className="max-w-[90%] mx-auto!">
                {/* info section */}
                <div className="flex gap-1.5 mt-5!">
                  <Icon
                    as={FaRegUserCircle}
                    fontSize={16}
                    color={"brand.500"}
                  />
                  <Text color={"brand.500"} className="font-400!">
                    {t("menu.menuProfile.app")}
                  </Text>
                </div>
                {/* forms */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-5 mt-3!">
                    <Controller
                      name="language"
                      control={control}
                      render={({ field }) => (
                        <SelectCompoent
                          label={t("menu.label.interfaceLanguage")}
                          items={languageOptions.map((option) => ({
                            value: option.value,
                            label: option.label,
                            avatar: option.image,
                          }))}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}
                          isClearable={false}
                        />
                      )}
                    />

                    <SelectCompoent
                      label={t("menu.label.theme")}
                      items={themeOptions.map((option) => ({
                        value: option.value,
                        label: option.label,
                      }))}
                      isClearable={false}
                      onValueChange={(value) => {
                        setColorMode(value as "light" | "dark");
                      }}
                      value={colorMode}
                    />

                    <RangeSlider
                      label={t("menu.label.fontSize")}
                      min={12}
                      max={18}
                      step={0.1}
                      defaultValue={[fontSize]}
                      onChange={handleChange}
                    />
                    <StorageIndexDb />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MenuSettings;

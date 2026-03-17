import Avatar from "@/components/ui/avatar/Avatar";
import {
  ColorModeButton,
  useColorMode,
} from "@/components/ui/provider/color-mode";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import Heading from "@/components/ui/typography/Heading";
import Subtext from "@/components/ui/typography/SubText";
import React, { useEffect, useRef, useState } from "react";
import DegreeCount from "../ui/DegreeCount";
import Separator from "@/components/ui/separator/Separator";
import { CloseButton, Drawer, Icon, Image, QrCode } from "@chakra-ui/react";
import IconButton from "@/components/ui/buttons/IconButton";
import { MdDownload, MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Text from "@/components/ui/typography/Text";
import { FaRegUserCircle } from "react-icons/fa";

import { MenuMode } from "../Menu";
import InputForm from "@/components/ui/input/InputForm";
import Checkbox from "@/components/ui/checkbox/Checkbox";
import { Controller, useForm } from "react-hook-form";
import { BiQrScan } from "react-icons/bi";
import { TbBorderCornerIos, TbBorderCornerRounded } from "react-icons/tb";
import Button from "@/components/ui/buttons/Button";
import { FaXmark } from "react-icons/fa6";
import { setMenuMode } from "@/store/params/params.slice";
import { putUser } from "@/service/user-route";
import { showToast } from "@/utils/showToaster";
import { useMutation } from "@tanstack/react-query";
import { useActions } from "@/hooks/use-actions/useActions";
import { IoIosShareAlt } from "react-icons/io";
import { useTranslation } from "@/i18n/languageConfig";

type ProfileFormValues = {
  fullName: string;
  agreeOrganization: boolean;
  agreeFamily: boolean;
};

type PropsPage = {
  closeDrawer: () => void;
};

const MenuProfile = ({ closeDrawer }: PropsPage) => {
  // -----------------------------------------------  HOOKS
  useColorMode();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { setUser } = useActions();
  const { t } = useTranslation();
  // -----------------------------------------------  STATES
  const [isShort, setIsShort] = useState(false);
  const { control, setValue, reset, watch } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: user.user.fullname || "",
      agreeOrganization: user.user.invite_to_organization ?? true,
      agreeFamily: user.user.invite_to_family ?? false,
    },
  });

  useEffect(() => {
    isFirstRender.current = true; // reset() dan keyin trigger bo'lmasligi uchun
    reset({
      fullName: user.user.fullname || "",
      agreeOrganization: user.user.invite_to_organization ?? true,
      agreeFamily: user.user.invite_to_family ?? false,
    });
  }, [
    reset,
    user.user.fullname,
    user.user.invite_to_organization,
    user.user.invite_to_family,
  ]);

  const putUserMutation = useMutation({
    mutationFn: (data: ProfileFormValues) =>
      putUser({
        user_id: user.user.id,
        fullname: data.fullName,
        invite_to_family: data.agreeFamily,
        invite_to_organization: data.agreeOrganization,
      }),
    onSuccess: (_, variables) => {
      setUser({
        ...user.user,
        fullname: variables.fullName,
        invite_to_family: variables.agreeFamily,
        invite_to_organization: variables.agreeOrganization,
      });
      showToast({ type: "success", title: "Профиль обновлён" });
    },
    onError: () => {
      showToast({ type: "error", title: "Не удалось обновить профиль" });
    },
  });

  // Auto-save: foydalanuvchi o'zi o'zgartirsa 600ms debounce bilan saqlaydi.
  // isFirstRender=true bo'lsa (mount yoki reset dan keyin) — ishga tushmaydi.
  const isFirstRender = useRef(true);
  const watchedValues = watch();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      putUserMutation.mutate(watchedValues);
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watchedValues.fullName,
    watchedValues.agreeOrganization,
    watchedValues.agreeFamily,
  ]);

  const telegramLink = user.user.telegram_username
    ? `https://t.me/${user.user.telegram_username}`
    : `https://t.me/${user.user.telegram_id}`;
  console.log("Telegram Link:", telegramLink);

  // ----------------------------------------------- FUNCTIONS

  return (
    <div>
      <ScrollArea size={"xs"} orientation="vertical">
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
                <Icon as={FaRegUserCircle} fontSize={16} color={"brand.500"} />
                <Text color={"brand.500"} className="font-400!">
                  {t("menu.menuProfile.personalData")}
                </Text>
              </div>
              {/* forms — auto-saves on every change, no submit button needed */}
              <div>
                <div className="flex flex-col gap-5 mt-3!">
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <InputForm
                        label="Под каким именем меня видно"
                        isRequired={false}
                        {...field}
                        placeholder="Введите название карты"
                        clearSize="small"
                        clearMethod={() => setValue("fullName", "")}
                      />
                    )}
                  />
                  <Controller
                    name="agreeOrganization"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        label={t("menu.label.canBeInvitedOrg")}
                        size="md"
                        checked={field.value}
                        onCheckedChange={(details) =>
                          field.onChange(Boolean(details.checked))
                        }
                      />
                    )}
                  />
                  <Controller
                    name="agreeFamily"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        label={t("menu.label.canBeInvitedFam")}
                        size="md"
                        checked={field.value}
                        onCheckedChange={(details) =>
                          field.onChange(Boolean(details.checked))
                        }
                      />
                    )}
                  />
                </div>
              </div>
              {/* QR-CODE */}
              <div>
                <Separator
                  size="md"
                  variant="solid"
                  className="w-full! mx-auto! mt-4!"
                />
                <div className="flex gap-1.5 mt-5!">
                  <Icon as={BiQrScan} fontSize={16} color={"brand.500"} />
                  <Text color={"brand.500"} className="font-400!">
                    {t("menu.menuProfile.myQrCode")}
                  </Text>
                </div>
                {/* QR */}
                <div className="w-[180px]! h-[180px]! mx-auto!  mt-7.5! relative">
                  <Icon
                    as={TbBorderCornerRounded}
                    color={"brand.500"}
                    className="absolute left-0 top-0"
                  />
                  <Icon
                    as={TbBorderCornerRounded}
                    color={"brand.500"}
                    className="absolute left-0 bottom-0 rotate-270"
                  />
                  <Icon
                    as={TbBorderCornerRounded}
                    color={"brand.500"}
                    className="absolute right-0 top-0 rotate-90"
                  />
                  <Icon
                    as={TbBorderCornerRounded}
                    color={"brand.500"}
                    className="absolute right-0 bottom-0 rotate-180"
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <QrCode.Root value={telegramLink} size={"md"}>
                      <QrCode.Frame>
                        <QrCode.Pattern />
                      </QrCode.Frame>
                      <QrCode.Overlay>
                        <div>
                          <Avatar
                            ring="ringQRcode"
                            fullName={user.user.fullname}
                            avatar={user.user.telegram_avatar}
                          />
                        </div>
                      </QrCode.Overlay>
                    </QrCode.Root>
                  </div>
                </div>
                {/* buttons sender */}
                <div className="w-[180px]! mx-auto! mt-[30px]! flex flex-col gap-4">
                  <Button
                    type="submit"
                    variant={"solid"}
                    bg={"brand.500"}
                    loading={putUserMutation.isPending}
                  >
                    <Icon as={IoIosShareAlt} fontSize={16} color={"#fff"} />
                    <Text color={"#fff"}>{t("actions.share")}</Text>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    borderColor="var(--main-color)"
                    borderWidth={"2px"}
                  >
                    <Icon as={MdDownload} fontSize={16} color={"brand.500"} />
                    <Text
                      color={"var(--text-lbrand-dwhite)!"}
                      className="font-[400]!"
                    >
                      {" "}
                      {t("actions.download")}
                    </Text>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MenuProfile;

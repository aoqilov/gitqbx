import PageLayout from "@/components/layouts/page-layout/PageLayout";
import Image from "@/components/ui/image/Image";
import InputRequiredIconTooltip from "@/components/ui/input/InputRequiredIconTooltip";
import { useColorMode } from "@/components/ui/provider/color-mode";
import Select from "@/components/ui/select/Select";
import Separator from "@/components/ui/separator/Separator";
import Subtext from "@/components/ui/typography/SubText";
import Text from "@/components/ui/typography/Text";
import {
  paymentsViewSchema,
  paymentsViewSchemaValues,
} from "@/validation/payments-zod/payments-view";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CurrencyOption } from "../card-link-view/CardLinkView";
import Button from "@/components/ui/buttons/Button";
import { Icon } from "@chakra-ui/react";
import InputMaskNumber from "@/components/ui/input/InputMaskNumber";
import { IoInformationCircleOutline } from "react-icons/io5";
import { GoCreditCard } from "react-icons/go";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/languageConfig";
import { SelectCompoent } from "@/components/ui/select/SelectCompoent";

const PaymentsView: FC = () => {
  // -----------------------  HOOKS
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { t } = useTranslation("workspace.pages.payments.");

  // -----------------------  STATE

  const personTypes: CurrencyOption[] = [
    { value: "individual", label: t("segmentinvidual") },
    { value: "legal", label: t("segmentlegal") },
  ];

  const options = [
    {
      value: "$",
      label: `$ ${t("optiondollar")}`,
      sum: 14,
      text: t("optiondollar"),
    },
    {
      value: "₽",
      label: `₽ ${t("opitonrubl")}`,
      sum: 1066,
      text: t("opitonrubl"),
    },
    {
      value: "Cум",
      label: ` ${t("optionsum")}`,
      sum: 171000,
      text: t("optionsum"),
    },
  ];
  const {
    control,
    handleSubmit,
    setValue,
    // resetField,
    // reset,
    watch,
    formState: { errors },
  } = useForm<paymentsViewSchemaValues>({
    resolver: zodResolver(paymentsViewSchema),
    defaultValues: {
      currentSum: "$",
      userPhoneNumber: "+998",
      userType: "individual",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [activeCurrency, setActiveCurrency] = useState(options[0]);
  //
  const watchUserType = watch("userType");
  console.log("watch user type", watchUserType);

  // -----------------------  QUERYS
  // -----------------------  FUNCTIONS
  function onSubmit() {
    // console.log(values);
  }
  return (
    <>
      <PageLayout>
        {/* Asosiy konteyner: To'liq balandlik va Flex ustun */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full">
            <TemplateHeader title="Оплата услуги" showBack={true} />
            {/* 1. Markaziy qism (ScrollArea) - flex-1 barcha bo'sh joyni egallaydi */}
            <div className="relative mt-8! py-6! px-4! rounded-[20px]! border! border-(--main-color)!">
              <div className="w-full py-5! px-2">
                {/* HEADER */}
                <div className="text-center mb-4">
                  <div className="flex justify-center">
                    <Image
                      className="w-20"
                      src="/assets/images/logoBrandColor.png"
                      alt="Логотип"
                    />
                  </div>
                  <Separator
                    size="xs"
                    w="full"
                    className="my-1!"
                    borderColor={
                      colorMode === "light" ? undefined : "brand.500"
                    }
                  />
                  <Subtext fontSize="0.85em">{t("titlelogodesc")}</Subtext>
                </div>

                {/* INPUTS */}
                <div className="flex flex-col gap-5 mt-7.5!">
                  {/* Usluga nomi */}
                  <div className="flex flex-col">
                    <Text
                      className="mb-1.25!"
                      fontSize={"0.85em"}
                      color={"var(--text-label)"}
                    >
                      {t("service")}
                    </Text>
                    <Text fontSize={"1em"} color={"brand.500"}>
                      {t("nameservice")}
                    </Text>
                  </div>

                  {/* Narx tanlash */}
                  <div>
                    <div className="flex items-end gap-5">
                      <Controller
                        name="currentSum"
                        control={control}
                        render={({ field }) => (
                          <SelectCompoent
                            {...field}
                            isRequired
                            label={t("label.subscriptionPrice")}
                            placeholder={"Valyuta"}
                            items={options}
                            error={errors.currentSum?.message}
                            isClearable={false}
                            onValueChange={(value) => {
                              const selectedOption = options.find(
                                (option) => option.value === value,
                              );
                              if (selectedOption) {
                                setActiveCurrency(selectedOption); // Ensure selectedOption is defined
                              }
                            }}
                            value={activeCurrency!.value}
                          />
                        )}
                      />
                      <Text className="w-full!">
                        <span className="font-bold! text-1.4em! text-(--main-color)">
                          {activeCurrency.sum}
                        </span>{" "}
                        <span>
                          {activeCurrency.value} / {t("month")}
                        </span>
                      </Text>
                    </div>
                  </div>

                  {/* Shaxs turi */}
                  <div>
                    <Controller
                      name="userType"
                      control={control}
                      render={({ field }) => (
                        <SelectCompoent
                          label={t("label.buyer")}
                          placeholder={t("placeholder.buyer")}
                          isClearable={false}
                          items={personTypes}
                          value={field.value}
                          error={errors.userType?.message}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setActiveCurrency(options[0]);
                          }}
                        />
                      )}
                    />
                  </div>

                  {/* Telefon raqami (shartli) */}
                  {watchUserType !== "individual" && (
                    <div className="flex flex-col gap-4">
                      <Controller
                        name="userPhoneNumber"
                        control={control}
                        render={({ field }) => (
                          <InputMaskNumber
                            {...field}
                            mask="+998 (99) 999-99-99"
                            label={t("label.contactNumber")}
                            error={errors.userPhoneNumber?.message}
                            clearMethod={() =>
                              setValue("userPhoneNumber", "+998 ")
                            }
                          />
                        )}
                      />
                      <div className="flex gap-2.5">
                        <Icon
                          as={IoInformationCircleOutline}
                          color={"brand.500"}
                          size={"md"}
                        />
                        <Subtext>{t("descinfo")}</Subtext>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Pastki qism (Buttons) - Har doim pastda qotib turadi */}
            <div className="w-full mt-40!  py-2! bg-transparent  ">
              <div className="w-full flex flex-col gap-3">
                <Button type="submit" variant="solid" backgroundColor={"#000"}>
                  <Text color={"white"}>{t("btnpay")}</Text>
                  <Image
                    src="/assets/images/click-icon.png"
                    alt="click"
                    className="w-[27px!] h-[25px!]"
                  />
                  <Text fontSize={"1.4em"} color={"white"}>
                    Click
                  </Text>
                </Button>

                <Button
                  type="submit"
                  variant="solid"
                  backgroundColor={"#7000FF"}
                >
                  <Text color={"white"}>{t("btnpay")}</Text>
                  <Image
                    src="/assets/images/uzum-icon.png"
                    alt="uzum"
                    className="w-[27px!] h-[25px!]"
                  />
                  <Text fontSize={"1.4em"} color={"white"}>
                    Uzum Bank
                  </Text>
                </Button>

                <Button
                  type="submit"
                  variant="solid"
                  backgroundColor={"#EAE5D5"}
                >
                  <Text color={"#000"}>{t("btnpay")}</Text>
                  <Image
                    src="/assets/images/payme-icon.png"
                    alt="payme"
                    className="w-[27px!] h-[25px!]"
                  />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  borderColor="var(--main-color)"
                  onClick={() => {
                    navigate("/app/payments/card-link");
                  }}
                >
                  <Text color={colorMode === "light" ? "brand.500" : "white"}>
                    {t("btnpay")} Quibnix
                  </Text>
                  <Icon as={GoCreditCard} fontSize={20} color={"brand.500"} />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </PageLayout>
    </>
  );
};

export default PaymentsView;

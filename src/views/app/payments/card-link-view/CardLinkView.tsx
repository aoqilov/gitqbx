import InputForm from "@/components/ui/input/InputForm";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import {
  cardLinkSchema,
  cardLinkSchemaValues,
} from "@/validation/payments-zod/card-link-view";
import Button from "@/components/ui/buttons/Button";
import Text from "@/components/ui/typography/Text";
import { Icon } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/provider/color-mode";
import Image from "@/components/ui/image/Image";
import Separator from "@/components/ui/separator/Separator";
import Subtext from "@/components/ui/typography/SubText";
import InputRequiredIconTooltip from "@/components/ui/input/InputRequiredIconTooltip";
import InputCardPayment from "@/components/ui/input/InputCardPayment";
import PageLayout from "@/components/layouts/page-layout/PageLayout";
import ScrollArea from "@/components/ui/scroll-area/SrcollArea";
import TemplateHeader from "@/components/shared/template-header/TemplateHeader";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/languageConfig";
import { SelectCompoent } from "@/components/ui/select/SelectCompoent";

export interface CurrencyOption {
  value: string;
  label: string;
  sum?: number;
  text?: string;
}
const CardLinkView = () => {
  // ----------------------------------  HOOKS
  const { t } = useTranslation("workspace.pages.cardlink.");

  const options: CurrencyOption[] = [
    { value: "$", label: `$ ${t("optiondollar")}`, sum: 14, text: "доллар" },
    { value: "₽", label: `₽ ${t("opitonrubl")}`, sum: 1066, text: "рубль" },
    { value: "Cум", label: `${t("optionsum")}`, sum: 171000, text: "сум" },
  ];
  // ----------------------------------  HOOK
  const navigate = useNavigate();

  // ----------------------------------  STAATE
  const {
    control,
    handleSubmit,
    setValue,
    // resetField,
    // reset,
    watch,
    formState: { errors },
  } = useForm<cardLinkSchemaValues>({
    resolver: zodResolver(cardLinkSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      cardDate: "",
      cardCvvcode: "",
      zipCode: "",
      currentSum: "$",
    },
    mode: "onChange", // 🔹 yozish paytida validatsiya
    reValidateMode: "onChange", // 🔹 input tuzatganda qayta tekshiradi
  });

  const cardNumber = watch("cardNumber");
  // Agar birinchi belgi '4' bo'lsa, bu Visa (bo'sh bo'lsa ham tekshiramiz)
  const isVisa = cardNumber?.replace(/\s/g, "").startsWith("4");

  const [activeCurrency, setActiveCurrency] = useState<CurrencyOption | null>(
    options[0],
  );
  // --------------------------------  FUNCTIONS

  function onSubmit(values: cardLinkSchemaValues) {
    const payload = {
      ...values,
      cardNumber: values.cardNumber.replace(/\s/g, ""),
      cardDate: values.cardDate.replace(/\D/g, ""),
    };
    console.log("Submitted Data:", payload);

    // console.log(payload);
  }

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, "") // faqat raqam
      .slice(0, 16) // max 16 ta
      .replace(/(.{4})/g, "$1 ") // har 4 tadan keyin space
      .trim();
  }

  function formatCardDate(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 4);
    if (numbers.length <= 2) {
      return numbers;
    }
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }

  const { colorMode } = useColorMode();
  return (
    <PageLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col h-[calc(100vh-80px)]! w-full ">
          <ScrollArea size={"xs"} orientation="vertical" isShow={false}>
            <TemplateHeader title={t("title")} showBack={true} />

            <div className="flex-1 w-full py-5! overflow-hidden relative">
              <div className="    py-6! px-4! rounded-[20px]! border! border-(--main-color)!">
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
                <div className="flex flex-col gap-5 mt-7.5! ">
                  <div>
                    <Text
                      className="mb-1.25!"
                      fontSize={"0.85em"}
                      lineHeight={"100%!"}
                      color={"var(--text-label)"}
                    >
                      {t("price")} <InputRequiredIconTooltip />
                    </Text>

                    <div className="flex items-center gap-5">
                      <Controller
                        name="currentSum"
                        control={control}
                        render={({ field }) => (
                          <SelectCompoent
                            {...field}
                            placeholder={"Valyuta"}
                            items={options}
                            error={errors.currentSum?.message}
                            isClearable={false}
                            onValueChange={(value) => {
                              const selectedOption = options.find(
                                (option) => option.value === value,
                              );
                              setActiveCurrency(selectedOption!);
                            }}
                            value={activeCurrency!.value}
                          />
                        )}
                      />
                      <Text className=" w-full" color={"var(--text-def)"}>
                        <span className="font-bold! text-1.4em! text-(--main-color)">
                          {activeCurrency!.sum}
                        </span>{" "}
                        <span>
                          {activeCurrency!.value} / {t("month")}
                        </span>
                      </Text>
                    </div>
                  </div>
                  <Controller
                    name="cardNumber"
                    control={control}
                    render={({ field }) => (
                      <InputCardPayment
                        {...field}
                        label={t("label.cardnumber")}
                        placeholder={"9999 9999 9999 9999"}
                        error={errors.cardNumber?.message}
                        isRequired={true}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="cardName"
                    control={control}
                    render={({ field }) => (
                      <InputForm
                        label={t("label.cardname")}
                        isRequired={false}
                        {...field}
                        placeholder={t("placeholder.cardname")}
                        clearSize="small"
                        error={errors.cardName?.message}
                        clearMethod={() => setValue("cardName", "")}
                      />
                    )}
                  />
                  <div className="grid grid-cols-2 gap-5">
                    <Controller
                      name="cardDate"
                      control={control}
                      render={({ field }) => (
                        <InputForm
                          {...field}
                          label={t("label.carddate")}
                          placeholder={t("placeholder.carddate")}
                          error={errors.cardDate?.message}
                          clearMethod={() => setValue("cardDate", "")}
                          isRequired={true}
                          clearSize="small"
                          onChange={(e) => {
                            const formatted = formatCardDate(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      )}
                    />

                    {isVisa && (
                      <Controller
                        name="cardCvvcode"
                        control={control}
                        render={({ field }) => (
                          <InputForm
                            {...field}
                            label={t("label.cardcvvcode")}
                            placeholder={t("placeholder.cardcvvcode")}
                            maxLength={4}
                            isRequired={true}
                            clearSize="small"
                            error={errors.cardCvvcode?.message}
                            clearMethod={() => setValue("cardCvvcode", "")}
                          />
                        )}
                      />
                    )}
                  </div>
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <InputForm
                        {...field}
                        maxLength={6}
                        label={t("label.zipcode")}
                        placeholder={t("placeholder.zipcode")}
                        clearSize="small"
                        error={errors.zipCode?.message}
                        isRequired={true}
                        clearMethod={() => setValue("zipCode", "")}
                      />
                    )}
                  />
                </div>
                <div className="flex gap-2.5! mt-10!">
                  <div>
                    <Icon
                      as={IoMdInformationCircleOutline}
                      color={"brand.500"}
                    />
                  </div>
                  <div>
                    <Subtext>{t("descinfo")}</Subtext>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="w-full   flex items-center justify-center  py-2!">
            <div className="w-full flex flex-col gap-3.75! ">
              <Button
                type="submit"
                variant="solid"
                bg={"var(--main-color)"}
                onClick={() => {
                  navigate("/app/payments/loading");
                }}
              >
                <Text color={"white"}>
                  {t("btnpay")}{" "}
                  <span className="font-bold! mr-1">{activeCurrency?.sum}</span>{" "}
                  {activeCurrency?.value}
                </Text>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </PageLayout>
  );
};

export default CardLinkView;

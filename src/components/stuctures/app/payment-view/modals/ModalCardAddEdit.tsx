import {
  DrawerComponentBasic,
  ModalProps,
} from "@/components/ui/drawer/DrawerComponentBasic";
import InputForm from "@/components/ui/input/InputForm";
import InputCardPayment from "@/components/ui/input/InputCardPayment";
import { showToast } from "@/utils/showToaster";
import { Controller } from "react-hook-form";
import { MdOutlineCreditCard } from "react-icons/md";
import { VscEdit } from "react-icons/vsc";
import { cardLinkSchemaValues } from "@/validation/payments-zod/card-link-view";
import { useTranslation } from "@/i18n/languageConfig";

interface CardProps extends ModalProps {
  mode: "edit" | "add";
  cancelSelection: () => void;
  initialData?: {
    key: string;
    cardName: string;
    cardNum: string;
    cardDate: string;
  } | null;
}

export const ModalCardAddEdit = ({
  open,
  close,
  mode,
  initialData,
  cancelSelection,
}: CardProps) => {
  const isEdit = mode === "edit";
  // ------------------------------------------------------ HOOKS
  const { t } = useTranslation("workspace.pages.payment.");

  const handleSubmit = async (data: cardLinkSchemaValues) => {
    const payload = {
      ...data,
      cardNumber: data.cardNumber.replace(/\s/g, ""),
      cardDate: data.cardDate.replace(/\D/g, ""),
    };
    console.log(isEdit ? "UPDATE:" : "CREATE:", payload);
    showToast({ type: "success" });
    if (isEdit) cancelSelection();
    close();
  };

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatCardDate(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 4);
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }

  return (
    <DrawerComponentBasic<cardLinkSchemaValues>
      open={open}
      onOpenChange={close}
      title={isEdit ? t("titleEdit") : t("titleAdd")}
      titleIcon={isEdit ? VscEdit : MdOutlineCreditCard}
      buttonLabel={isEdit ? t("btnEdit") : t("btnSave")}
      onSubmit={handleSubmit}
      defaultValues={{
        cardName: isEdit ? initialData?.cardName || "" : "",
        cardNumber: isEdit ? initialData?.cardNum || "" : "",
        cardDate: isEdit ? initialData?.cardDate || "" : "",
        cardCvvcode: "",
        zipCode: "",
        currentSum: "$",
      }}
    >
      {(form) => {
        const {
          setValue,
          control,
          watch,
          formState: { errors },
        } = form;

        // karta raqamining birinchi belgisi '4' bo'lsa — Visa (CVV ko'rsatiladi)
        const cardNumber = watch("cardNumber");
        const isVisa = cardNumber?.replace(/\s/g, "").startsWith("4");

        return (
          <div className="flex flex-col gap-5 pb-20">
            {/* Название карты */}
            <Controller
              name="cardName"
              control={control}
              render={({ field }) => (
                <InputForm
                  label={t("label.cardname")}
                  placeholder={t("placeholder.cardname")}
                  {...field}
                  isRequired={false}
                  error={errors.cardName?.message}
                  clearMethod={() => setValue("cardName", "")}
                />
              )}
            />

            {/* Номер карты */}
            <Controller
              name="cardNumber"
              control={control}
              render={({ field }) => (
                <InputCardPayment
                  {...field}
                  label={t("label.cardnumber")}
                  placeholder="9999 9999 9999 9999"
                  isRequired
                  error={errors.cardNumber?.message}
                  onChange={(e) =>
                    field.onChange(formatCardNumber(e.target.value))
                  }
                />
              )}
            />

            {/* Срок карты + Секретный код */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="cardDate"
                control={control}
                render={({ field }) => (
                  <InputForm
                    {...field}
                    label={t("label.carddate")}
                    placeholder={t("placeholder.carddate")}
                    isRequired
                    clearSize="small"
                    error={errors.cardDate?.message}
                    clearMethod={() => setValue("cardDate", "")}
                    onChange={(e) =>
                      field.onChange(formatCardDate(e.target.value))
                    }
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
                      isRequired
                      clearSize="small"
                      error={errors.cardCvvcode?.message}
                      clearMethod={() => setValue("cardCvvcode", "")}
                    />
                  )}
                />
              )}
            </div>

            {/* ZIP */}
            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <InputForm
                  {...field}
                  label="ZIP / Почтовый адрес"
                  placeholder=""
                  maxLength={6}
                  isRequired
                  clearSize="small"
                  error={errors.zipCode?.message}
                  clearMethod={() => setValue("zipCode", "")}
                />
              )}
            />
          </div>
        );
      }}
    </DrawerComponentBasic>
  );
};

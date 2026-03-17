
import {
  Input as ChakraInput,
  InputProps,
  Field,
  Image,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────
export interface InputCardPaymentProps extends InputProps {
  label?: string;
  error?: string;
  isRequired?: boolean;
}

// ─── Card logo map ───────────────────────────────────────
const CARD_LOGOS = {
  uzcard: "/assets/images/uzcard2.png",
  humo: "/assets/images/humo.png",
  visa: "/assets/images/visaCard.png",
  default: "/assets/images/defimagecard.png",
} as const;

const getCardLogoSrc = (cardNumber: string): string => {
  const raw = cardNumber.replace(/\s/g, "");

  if (raw.startsWith("8600") || raw.startsWith("5614"))
    return CARD_LOGOS.uzcard;
  if (raw.startsWith("9860")) return CARD_LOGOS.humo;
  if (raw.startsWith("4")) return CARD_LOGOS.visa;

  return CARD_LOGOS.default;
};

// ─── Component ───────────────────────────────────────────
const InputCardPayment: FC<InputCardPaymentProps> = ({
  error,
  label,
  isRequired,
  ...props
}) => {
  const valueStr = typeof props.value === "string" ? props.value : "";
  const logoSrc = useMemo(() => getCardLogoSrc(valueStr), [valueStr]);

  return (
    <Field.Root invalid={!!error}>
      <div className="relative w-full">
        {label && (
          <Field.Label
            className="mb-[5px]!"
            fontSize="0.85em"
            lineHeight="100%!"
            color="var(--text-label)"
          >
            {label}
          </Field.Label>
        )}

        <ChakraInput
          {...props}
          borderRadius="30px"
          borderColor="var(--border-input)"
          fontSize="0.9em"
          color={"var(--text-def)"}
          _invalid={{ borderColor: "error.500" }}
          _focus={{ borderColor: error ? "error.500" : "brand.500" }}
        />

        <div className="absolute right-3 bottom-2  z-10">
          <Image
            src={logoSrc}
            alt="Card logo"
            w="30px"
            h="20px"
            objectFit="contain"
          />
        </div>
      </div>

      {error && (
        <Field.ErrorText fontSize="xs" color="error.500">
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputCardPayment;

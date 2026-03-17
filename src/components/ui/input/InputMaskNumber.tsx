import { FC, useRef, useEffect } from "react";
import { Input as ChakraInput, InputProps, Field } from "@chakra-ui/react";
import { withMask } from "use-mask-input";

import { useColorMode } from "../provider/color-mode";
import IconButton from "../buttons/IconButton";
import { FaXmark } from "react-icons/fa6";
import InputRequiredIconTooltip from "./InputRequiredIconTooltip";

export interface MaskedInputPropsI extends Omit<InputProps, "onChange"> {
  label?: string;
  clearMethod?: () => void;
  error?: string;
  clearSize?: "small" | "large";
  isRequired?: boolean;
  mask: string;
  onChange?: (value: string) => void;
}

const InputMaskNumber: FC<MaskedInputPropsI> = ({
  clearMethod,
  error,
  label,
  clearSize,
  isRequired,
  mask,
  onChange,
  ...props
}) => {
  const theme = useColorMode();
  const { value } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  // withMask ref — mask changes bo'lganda qayta apply
  useEffect(() => {
    if (inputRef.current) {
      const maskRef = withMask(mask);
      maskRef(inputRef.current);
    }
  }, [mask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Field.Root invalid={!!error}>
      <div className="relative w-full">
        {label && (
          <Field.Label
            className="mb-1.25!"
            fontSize={"0.85em"}
            lineHeight={"100%!"}
            color={"var(--text-label)"}
          >
            {label}
            {isRequired && <InputRequiredIconTooltip />}
          </Field.Label>
        )}

        <ChakraInput
          {...props}
          ref={inputRef}
          placeholder={mask}
          onChange={handleChange}
          borderRadius="30px"
          borderColor={"var(--border-input)"}
          fontSize="0.9em"
          color={theme.colorMode === "light" ? "#000" : "#fff"}
          _invalid={{
            borderColor: "error.500",
          }}
          _focus={{
            borderColor: error ? "error.500" : "brand.500",
          }}
        />

        {clearMethod && value && (
          <div
            className={`absolute ${label ? "bottom-2.5" : "bottom-1.75"} right-2`}
          >
            <IconButton
              icon={FaXmark}
              onClick={clearMethod}
              size={
                clearSize == "small"
                  ? "5.5em"
                  : clearSize == "large"
                    ? "2xs"
                    : ""
              }
              borderColor="brand.500"
              variant="outline"
              iColor="brand.500"
              colorPalette="brand"
              color="#fff"
            />
          </div>
        )}
      </div>

      {error && (
        <Field.ErrorText fontSize="xs" color={"error.500"}>
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default InputMaskNumber;

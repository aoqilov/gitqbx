import { FC } from "react";
import {
  Input as ChakraInput,
  InputProps,
  Field,
  Icon,
  InputGroup,
  Span,
} from "@chakra-ui/react";

import { useColorMode } from "../provider/color-mode";
import IconButton from "../buttons/IconButton";
import { FaXmark } from "react-icons/fa6";
import InputRequiredIconTooltip from "./InputRequiredIconTooltip";
import { ImSearch } from "react-icons/im";
import { LuX } from "react-icons/lu";

export interface InputPropsI extends InputProps {
  label?: string;
  clearMethod?: () => void;
  error?: string;
  clearSize?: "small" | "large";
  isRequired?: boolean;
  showSearchIcon?: boolean;
  extraIcon?: React.ElementType; // dynamic icon
  onExtraIconClick?: () => void; // dynamic function
}

const InputForm: FC<InputPropsI> = ({
  clearMethod,
  error,
  label,
  clearSize,
  isRequired,
  showSearchIcon,
  extraIcon,
  onExtraIconClick,
  ...props
}) => {
  const theme = useColorMode();
  const { value, maxLength } = props;

  return (
    <Field.Root invalid={!!error}>
      <div className="relative w-full">
        {label && (
          <Field.Label
            className="mb-2! flex items-center gap-1.5! ml-4!"
            fontSize={"0.85em"}
            lineHeight={"100%!"}
            color={"var(--text-label)"}
          >
            {label}
            {isRequired && (
              <div>
                <InputRequiredIconTooltip />
              </div>
            )}
          </Field.Label>
        )}

        {showSearchIcon && (
          <Icon
            as={ImSearch}
            className="absolute left-4 top-2"
            fontSize={20}
            color={"var(--border-input)"}
          />
        )}

        <InputGroup
          endElement={
            maxLength ? (
              <Span
                color="fg.muted"
                textStyle="xs"
                whiteSpace="nowrap"
                // clear button bor bo'lsa, counter uni bilan to'qnashmasin
                mr={clearMethod && value ? "6" : "0"}
              >
                {String(value ?? "").length} / {maxLength}
              </Span>
            ) : undefined
          }
        >
          <ChakraInput
            {...props}
            borderRadius="30px"
            borderColor={
              value && String(value).trim() !== ""
                ? "brand.500"
                : "var(--border-input)"
            }
            fontSize="0.9em"
            color={theme.colorMode === "light" ? "#000" : "#fff"}
            pl={showSearchIcon ? "48px!" : "15px"}
            _invalid={{
              borderColor: "error.500",
            }}
            _focus={{
              shadow: "sm",
              borderColor: error ? "error.500" : "brand.500",
            }}
          />
        </InputGroup>

        {clearMethod && value && (
          <div
            className={`absolute ${label ? "bottom-2.75" : "bottom-1.75"} right-2`}
          >
            <div
              onClick={clearMethod}
              className="border! border-[var(--main-color)]! rounded-full! p-0.5! flex items-center justify-center"
            >
              <Icon as={LuX} boxSize={3} color={"brand.500"} />
            </div>
          </div>
        )}
        {extraIcon && (
          <div className={`absolute bottom-2.5  right-2.5`}>
            <Icon
              color={"brand.500"}
              as={extraIcon}
              onClick={onExtraIconClick}
              fontSize={20}
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

export default InputForm;

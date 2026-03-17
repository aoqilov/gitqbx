import { FC } from "react";
import {
  Textarea as ChakraTextarea,
  TextareaProps,
  Field,
  Span,
} from "@chakra-ui/react";

import { useColorMode } from "../provider/color-mode";
import InputRequiredIconTooltip from "./InputRequiredIconTooltip";

export interface TextareaPropsI extends TextareaProps {
  label?: string;
  error?: string;
  isRequired?: boolean;
}

const TextareaForm: FC<TextareaPropsI> = ({
  error,
  label,
  isRequired,
  ...props
}) => {
  const theme = useColorMode();
  const { value, maxLength, rows } = props;

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

        <ChakraTextarea
          {...props}
          borderRadius="20px"
          borderColor={
            value && String(value).trim() !== ""
              ? "brand.500"
              : "var(--border-input)"
          }
          fontSize="0.9em"
          color={theme.colorMode === "light" ? "#000" : "#fff"}
          className="px-4! py-3!"
          resize="vertical"
          _invalid={{
            borderColor: "error.500",
          }}
          _focus={{
            borderColor: "brand.500",
            outline: "none",
            boxShadow: "none",
          }}
          rows={rows || 4}
        />

        {maxLength && (
          <div className="absolute bottom-2 right-4 ">
            <Span color="fg.muted" textStyle="xs" whiteSpace="nowrap">
              {String(value ?? "").length} / {maxLength}
            </Span>
          </div>
        )}

        {error && <Field.ErrorText className="ml-4!">{error}</Field.ErrorText>}
      </div>
    </Field.Root>
  );
};

export default TextareaForm;

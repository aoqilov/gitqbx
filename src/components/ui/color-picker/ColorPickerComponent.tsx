"use client";

import { ColorPicker, HStack, Portal, parseColor } from "@chakra-ui/react";
import { FC } from "react";

interface AppColorPickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

const ColorPickerComponent: FC<AppColorPickerProps> = ({
  label = "Color",
  value,
  onChange,

  error,
}) => {
  return (
    <div>
      <ColorPicker.Root
        value={value ? parseColor(value) : undefined}
        onValueChange={(details) => onChange?.(details.value.toString("hex"))}
      >
        <ColorPicker.HiddenInput />

        {label && (
          <ColorPicker.Label
            className=" flex items-center gap-1.5! ml-4!"
            fontSize={"0.85em"}
            lineHeight={"100%!"}
            color={"var(--text-label)"}
          >
            {label}
          </ColorPicker.Label>
        )}

        <ColorPicker.Control>
          <ColorPicker.Input
            width={"150px"}
            borderRadius="30px"
            borderColor={
              value && String(value).trim() !== ""
                ? "brand.500"
                : "var(--border-input)"
            }
            fontSize="0.9em"
            _focus={{ borderColor: "brand.500" }}
          />
          <ColorPicker.Trigger border={"none"} />
        </ColorPicker.Control>

        <Portal>
          <ColorPicker.Positioner>
            <ColorPicker.Content>
              <ColorPicker.Area />
              <HStack>
                <ColorPicker.EyeDropper size="xs" variant="outline" />
                <ColorPicker.Sliders />
              </HStack>
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </Portal>
      </ColorPicker.Root>

      {error && <p className="error-message text-red-500">{error}</p>}
    </div>
  );
};

export default ColorPickerComponent;

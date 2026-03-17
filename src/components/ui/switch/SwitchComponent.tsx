

import { FC } from "react";
import { Switch as ChakraSwitch, Field } from "@chakra-ui/react";
import { ControllerRenderProps } from "react-hook-form";

interface SwitchPropsI extends Omit<
  ChakraSwitch.RootProps,
  "checked" | "onCheckedChange"
> {
  label?: string;
  error?: string;
  field?: ControllerRenderProps<any, any>;
}

const SwitchComponent: FC<SwitchPropsI> = ({
  label,
  error,
  field,
  ...props
}) => {
  return (
    <div className="relative">
      <ChakraSwitch.Root
        {...props}
        checked={field?.value}
        onCheckedChange={(e) => field?.onChange(e.checked)}
      >
        <ChakraSwitch.HiddenInput />
        <ChakraSwitch.Control
          borderRadius="full"
          bg={field?.value ? "#fff" : "transparent"}
          outline="1px solid"
          outlineColor={field?.value ? "#711CE9" : "#A4A4A4"}
        >
          <ChakraSwitch.Thumb bg={field?.value ? "#711CE9" : "#A4A4A4"} />
        </ChakraSwitch.Control>

        {label && <ChakraSwitch.Label fontSize={"0.85em"} ml="5px" color={field?.value ? "#711CE9" : "#A4A4A4"}>{label}</ChakraSwitch.Label>}
      </ChakraSwitch.Root>

      {error && (
        <Field.ErrorText fontSize="xs" color="error.500">
          {error}
        </Field.ErrorText>
      )}
    </div>
  );
};

export default SwitchComponent;

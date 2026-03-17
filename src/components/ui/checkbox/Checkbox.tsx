import { FC } from "react";
import { Checkbox as ChakraCheckbox, Field } from "@chakra-ui/react";

interface CheckboxPropsI extends ChakraCheckbox.RootProps {
  label?: string;
  error?: string;
}

const Checkbox: FC<CheckboxPropsI> = ({
  label,
  size = "sm",
  error,
  children,
  ...props
}) => {
  return (
    <div className="relative ">
      <ChakraCheckbox.Root {...props} size={size}>
        <ChakraCheckbox.HiddenInput />

        {/* Custom Control */}
        <ChakraCheckbox.Control
          w="16px"
          h="16px"
          borderRadius="5px"
          border="1px solid #711CE9"
          bg={props.checked ? "#711CE9" : "transparent"}
          _checked={{ bg: "#711CE9", borderColor: "#711CE9" }}
          _hover={{ borderColor: "#711CE9" }}
        />

        {/* Label */}
        <ChakraCheckbox.Label
          fontSize="0.85em"
          ml="0px"
          color={props.checked ? "#711CE9" : "var(--text-label)"}
        >
          {label}
        </ChakraCheckbox.Label>
      </ChakraCheckbox.Root>

      {error && (
        <Field.ErrorText fontSize="xs" color="error.500">
          {error}
        </Field.ErrorText>
      )}
    </div>
  );
};

export default Checkbox;

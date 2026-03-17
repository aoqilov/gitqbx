import { FC, PropsWithChildren } from "react";
import { Text as ChakraText, TextProps } from "@chakra-ui/react";

interface CustomTextProps extends TextProps {}

const Text: FC<PropsWithChildren<CustomTextProps>> = ({
  children,
  ...props
}) => {
  const { color, fontSize } = props;

  return (
    <ChakraText
      {...props}
      fontSize={fontSize ? fontSize : "0.9em"}
      fontWeight="light"
      color={color ? color : "var(--text-def)"}
    >
      {children}
    </ChakraText>
  );
};

export default Text;
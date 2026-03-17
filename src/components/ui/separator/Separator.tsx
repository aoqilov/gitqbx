import { FC } from "react";
import { Separator as ChakraSeparator, SeparatorProps } from "@chakra-ui/react";

interface SeparatorPropsI extends SeparatorProps {

}

const Separator: FC<SeparatorPropsI> = ({
  ...props
}) => {
  return (
    <ChakraSeparator borderColor={"var(--separator-base)"}  { ...props } />
  );
};

export default Separator;

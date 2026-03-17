import { FC, PropsWithChildren } from "react";
import {
  ScrollArea as ChakraScrollArea,
  ScrollAreaRootProps,
} from "@chakra-ui/react";

interface ScrollAreaPropsI extends ScrollAreaRootProps {
  orientation: "horizontal" | "vertical";
  isShow?: boolean;
}

const ScrollArea: FC<PropsWithChildren<ScrollAreaPropsI>> = ({
  children,
  orientation = "vertical",
  isShow = true,
  ...props
}) => {
  return (
    <ChakraScrollArea.Root {...props}>
      <ChakraScrollArea.Viewport>
        <ChakraScrollArea.Content>{children}</ChakraScrollArea.Content>
      </ChakraScrollArea.Viewport>

      {isShow && (
        <>
          <ChakraScrollArea.Scrollbar
            orientation={orientation}
            bg="transparent"
          >
            <ChakraScrollArea.Thumb bg="var(--subtext-color)" />
          </ChakraScrollArea.Scrollbar>
          <ChakraScrollArea.Corner />
        </>
      )}
    </ChakraScrollArea.Root>
  );
};

export default ScrollArea;

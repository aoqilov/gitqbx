import { EmptyState, VStack, BoxProps, Icon } from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { IoFileTrayFullOutline } from "react-icons/io5";
import Button from "../buttons/Button";

interface NoDataProps extends BoxProps {
  title?: string;
  description?: string;
  icon?: ReactNode | IconType;
  hasButton?: boolean;
  titleButton?: string;
  clickButton?: any;
}

const NoData = ({
  title = "Данных нет",
  description = "Похоже, здесь пока ничего нет",
  hasButton = false,
  titleButton = "Действие",
  clickButton,
  icon,
  ...props
}: NoDataProps) => {
  return (
    <EmptyState.Root {...props} className="">
      <EmptyState.Content>
        <EmptyState.Indicator>
          <Icon as={icon ? icon : IoFileTrayFullOutline} fontSize="5xl" />
        </EmptyState.Indicator>

        <VStack textAlign="center" maxW="300px" mx="auto">
          <EmptyState.Title color="var(--text-nodata)" lineHeight={"1.3"}>
            {title}
          </EmptyState.Title>
          <EmptyState.Description
            color="var(--text-nodata)"
            whiteSpace="wrap"
            fontSize={"0.85em"}
          >
            {description}
          </EmptyState.Description>
        </VStack>

        {hasButton && (
          <Button
            onClick={clickButton}
            mt={2}
            className="h-10! text-[1em]!"
            bg={"var(--main-color)"}
          >
            {titleButton}
          </Button>
        )}
      </EmptyState.Content>
    </EmptyState.Root>
  );
};

export default NoData;

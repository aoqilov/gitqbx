import { FC } from "react";
import { Icon, Button, Tooltip } from "@chakra-ui/react";
import { TiStarOutline } from "react-icons/ti";
import { FaStar } from "react-icons/fa";

const InputRequiredIconTooltip: FC = () => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        {/* <Button variant="ghost" size="sm"  minW={0} borderRadius="full"> */}
        <Icon as={FaStar} color="brand.300" fontSize={9}/>
        {/* </Button> */}
      </Tooltip.Trigger>

      {/* <Tooltip.Content bg="brand.500" color="white" fontSize="0.75rem">
        Обязательно
        <Tooltip.Arrow />
      </Tooltip.Content> */}
    </Tooltip.Root>
  );
};

export default InputRequiredIconTooltip;

import { Accordion, Box, Icon } from "@chakra-ui/react";
import { IoChevronDown, IoNotifications } from "react-icons/io5";
import { type ReactNode } from "react";
import Text from "../typography/Text";

interface AccordionContentItem {
  id: string | number;
  content: ReactNode;
}

interface AccordionNotificationProps {
  title?: string;
  items: AccordionContentItem[];
  defaultOpen?: boolean;
}

const AccordionNotification = ({
  title = "Напоминания",
  items,
  defaultOpen = false,
}: AccordionNotificationProps) => {
  return (
    <Accordion.Root
      collapsible
      defaultValue={defaultOpen ? ["notification"] : []}
      bg="#9F65F0"
      borderRadius={15}
    >
      <Accordion.Item value="notification" border="none">
        <Accordion.ItemTrigger
          px="3"
          py="2.5"
          bg="#9F65F0"
          color="white"
          borderRadius={15}
          maxH={40}
        >
          <IoNotifications />

          <Text
            flex="1"
            textAlign="left"
            fontWeight="600"
            fontSize="1em"
            color="white"
          >
            {title}
          </Text>

          {/* 👇 Auto state indicator */}
          <Accordion.ItemIndicator>
            <Icon
              as={IoChevronDown}
              transition="transform 0.2s"
              color={"white"}
            />
          </Accordion.ItemIndicator>
        </Accordion.ItemTrigger>

        <Accordion.ItemContent borderRadius={15}>
          {items.map((item) => (
            <Accordion.ItemBody key={item.id} bg="#AD77F8" pb={1} pt={1} px={3}>
              <div className="">- {item.content}</div>
            </Accordion.ItemBody>
          ))}
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default AccordionNotification;

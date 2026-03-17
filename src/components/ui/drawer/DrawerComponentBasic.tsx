import { Drawer, Portal, DrawerRootProps, Icon } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  UseFormReturn,
  DefaultValues,
} from "react-hook-form";

import Button from "../buttons/Button";
import { IconType } from "react-icons";
import Text from "../typography/Text";
import { IoCloseCircleOutline } from "react-icons/io5";

export interface ModalProps {
  open: boolean;
  close: () => void;
}

interface FormDrawerProps<T extends FieldValues> extends Omit<
  DrawerRootProps,
  "placement" | "open" | "onOpenChange" | "children"
> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  titleIcon?: IconType;
  defaultValues?: DefaultValues<T>; // ✅ TO‘G‘RI TYPE
  onSubmit: SubmitHandler<T>;
  children: (form: UseFormReturn<T>) => ReactNode;
  buttonBg?: string;
  buttonLabel?: string;
  buttonHide?: boolean;
}

export function DrawerComponentBasic<T extends FieldValues>({
  open,
  onOpenChange,
  title,
  titleIcon,
  defaultValues,
  onSubmit,
  children,
  buttonHide = false,
  buttonBg = "brand.500",
  buttonLabel = "Готово",
  ...rest
}: FormDrawerProps<T>) {
  const form = useForm<T>({
    mode: "onChange",
    criteriaMode: "all", // barcha errorlarni tutadi
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues);
    }
  }, [open]);

  return (
    <Drawer.Root
      {...rest}
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement="bottom"
      // initialFocusEl={() => null}
      closeOnInteractOutside={true}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            maxH="80vh"
            minH={"40vh"}
            borderTopRadius="24px"
          >
            {title && (
              <Drawer.Header>
                <Drawer.Title>
                  <div className="flex items-center gap-2">
                    <Icon as={titleIcon} fontSize={20} color={"brand.500"} />
                    <Text fontSize={"1.15em"} className="font-[600]!">
                      {title}
                    </Text>
                  </div>
                </Drawer.Title>
              </Drawer.Header>
            )}

            <Drawer.Body flex="1" overflowY="auto">
              {children(form)}
            </Drawer.Body>

            {buttonHide == false ? (
              <Drawer.Footer p="4">
                <Button
                  bg={buttonBg}
                  type="submit"
                  width="full"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                >
                  {buttonLabel}
                </Button>
              </Drawer.Footer>
            ) : null}
            <Drawer.CloseTrigger asChild>
              <Icon
                as={IoCloseCircleOutline}
                fontSize={25}
                color={"var(--border-input)"}
                className="mt-3! mr-2.5!"
              />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

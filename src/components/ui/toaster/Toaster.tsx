import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
  defineSlotRecipe,
} from "@chakra-ui/react";
import { toastAnatomy } from "@chakra-ui/react/anatomy";

export const toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
});

export const toasterSlotRecipe = defineSlotRecipe({
  slots: toastAnatomy.keys(),
  base: {
    root: {
      borderRadius: "15px",
      bg: "whiteAlpha.900",
      color: "brand.solid",
      borderWidth: "2px",
      py: "2.5",
      ps: "2.5",
      borderColor: "brand.solid",
      "&[data-type=warning]": {
        bg: "whiteAlpha.900",
        borderColor: "yellow.600",
        color: "yellow.600",
        "--toast-trigger-bg": "{white/10}",
        "--toast-border-color": "{white/40}",
      },
      "&[data-type=success]": {
        bg: "brand.solid",
        borderWidth: "0px",
        color: "white",
        "--toast-trigger-bg": "{white/10}",
        "--toast-border-color": "{white/40}",
      },
      "&[data-type=error]": {
        bg: "error.500",
        borderColor: "error.500",
        color: "white",
        "--toast-trigger-bg": "{white/10}",
        "--toast-border-color": "{white/40}",
      },
    },
  },
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="brand.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="0.5" flex="1" maxWidth="100%">
              {toast.title && (
                <Toast.Title fontSize="0.95em">{toast.title}</Toast.Title>
              )}
              {toast.description && (
                <Toast.Description fontSize="0.9em">
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};

import { toaster } from "@/components/ui/toaster/Toaster"

declare interface ToastApi {
    title: string;
    description: string;
    type: "info" | "warning" | "error" | "success" | "loading";
}

export const useToast = (props:ToastApi) => {
    return toaster.create({
        ...props,
        closable: true
    })
}
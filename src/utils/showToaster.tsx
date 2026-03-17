import { toaster } from "@/components/ui/toaster/Toaster";

type ToastType = "success" | "loading" | "error" | "warning";

interface ShowToastOptions {
  type: ToastType;
  title?: string;
  description?: string;
}

const defaultMessages: Record<
  ToastType,
  { title: string; description: string }
> = {
  success: {
    title: "Успешно сохранено",
    description: "Данные успешно обновлены",
  },
  loading: {
    title: "Загрузка...",
    description: "Пожалуйста, подождите",
  },
  error: {
    title: "Ошибка",
    description: "Не удалось выполнить операцию",
  },
  warning: {
    title: "Предупреждение",
    description: "Пожалуйста, заполните все обязательные поля",
  },
};

export const showToast = ({ type, title, description }: ShowToastOptions) => {
  const defaults = defaultMessages[type];

  toaster.create({
    type,
    title: title ?? defaults.title,
    description: description ?? defaults.description,
  });
};

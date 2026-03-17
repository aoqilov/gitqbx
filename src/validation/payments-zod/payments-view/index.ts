import { z } from "zod";

const phoneRegex = /^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;

export const paymentsViewSchema = z.object({
  userType: z.string().min(1, "обязательна"),
  userPhoneNumber: z
    .string()
    .regex(
      phoneRegex,
      "Telefon raqam majburiy va +998 (99) 999-99-99 formatida bo‘lishi kerak",
    ),
  currentSum: z.string().min(1, "Сумма обязательна"),
});

export type paymentsViewSchemaValues = z.infer<typeof paymentsViewSchema>;

import { z } from "zod";

export const cardLinkSchema = z.object({
  cardName: z.string().min(1, "Название карты обязательно"),

  cardNumber: z
    .string()
    .refine(
      (val) => val.replace(/\s/g, "").length === 16,
      "Номер карты должен содержать 16 цифр",
    ),

  cardDate: z.string().min(5, "Срок действия карты обязателен"),

  cardCvvcode: z.string().min(4, "CVV-код должен содержать не менее 4 цифр"),

  zipCode: z.string().min(6, "Почтовый индекс обязателен"),

  currentSum: z.string().min(1, "Сумма обязательна"),
});

export type cardLinkSchemaValues = z.infer<typeof cardLinkSchema>;

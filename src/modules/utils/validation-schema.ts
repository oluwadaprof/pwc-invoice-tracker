import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  quantity: z
    .number({ error: "Quantity must be a number" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
});

export type AddToCartFormData = z.infer<typeof addToCartSchema>;

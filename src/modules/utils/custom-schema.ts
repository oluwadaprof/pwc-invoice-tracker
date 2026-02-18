import { z } from "zod"

export const customProductSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters").max(100, "Service name is too long"),
  category: z.string().min(1, "Please select a category"),
  basePrice: z.string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  vatRate: z.string()
    .min(1, "VAT rate is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, "VAT rate must be between 0 and 100"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
}).refine(
  (data) => {
    if (data.category === "Zero-Rated" || data.category === "Exempt") {
      return data.vatRate === "0" || data.vatRate === ""
    }
    return true
  },
  {
    message: "VAT rate must be 0% for Zero-Rated and Exempt categories",
    path: ["vatRate"],
  }
)

export type CustomProductFormData = z.infer<typeof customProductSchema>
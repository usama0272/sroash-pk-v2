import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  line1: z.string().min(4, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(["COD"]),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string(),
        productId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
        size: z.string(),
        color: z.string(),
        name: z.string(),
      })
    )
    .min(1, "Your bag is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

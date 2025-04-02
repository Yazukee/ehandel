import { z } from "zod";
import { fromatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(fromatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places"
  );

// Schema för att lägga in produkter
export const insertProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 3 characters"),
  slug: z.string().min(2, "Slug must be at least 3 characters"),
  category: z.string().min(2, "Category must be at least 3 characters"),
  brand: z.string().min(2, "Brand must be at least 3 characters"),
  description: z.string().min(2, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invaild email adress"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/// Schema for signing up a user

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invaild email adress"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });

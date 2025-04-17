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
  email: z.string().email("Invaild email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/// Schema for signing up a user

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invaild email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });

// Cart Schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

/// Schema for the Shipping Address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characthers"),
  streetAddress: z.string().min(3, "Address must be at least 3 characthers"),
  city: z.string().min(3, "City must be at least 3 characthers"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characthers"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

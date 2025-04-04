import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// converterar prisma object till en vanlig JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// formatera number till decimaler
export function fromatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function formatError(error: unknown): string {
  if (error instanceof ZodError) {
    const fieldErrors = error.errors.map((err) => err.message);
    return fieldErrors.join(". ");
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = (error.meta as { target?: string[] })?.target;
    const field = target && target.length > 0 ? target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

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
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// format errors

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

//// Round number to 2 decimal places

export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}

// shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// format date and time
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // t.ex. 'maj'
    year: "numeric", // t.ex. '2025'
    day: "numeric", // t.ex. '24'
    hour: "numeric", // t.ex. '14'
    minute: "numeric", // t.ex. '30'
    hour12: false, // 24-timmarsformat
    timeZone: "Europe/Stockholm", // viktigt om servern är i annan zon
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // t.ex. 'fre'
    month: "short",
    year: "numeric",
    day: "numeric",
    timeZone: "Europe/Stockholm",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "Europe/Stockholm",
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "sv-SE",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "sv-SE",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "sv-SE",
    timeOptions
  );

  return {
    dateTime: formattedDateTime, // ex: "24 maj 2025 14:30"
    dateOnly: formattedDate, // ex: "fre 24 maj 2025"
    timeOnly: formattedTime, // ex: "14:30"
  };
};

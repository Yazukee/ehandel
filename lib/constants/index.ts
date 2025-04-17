export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "E-handel";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "E-forcecommoerce";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "admin@ehandel.com",
  password: "123456",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "Yaser OG",
  streetAddress: "Strandvägen 7",
  city: "Stockholm",
  postalCode: "128 35",
  country: "Sweden",
};

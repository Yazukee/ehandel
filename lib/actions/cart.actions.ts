"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

/// eslint-disable-next-line @typescript-eslint/no-explicit-any

// Calculate Cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // check for the cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not Found");

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //  Get Cart
    const cart = await getMyCart();

    //Parse and valid item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      // Create new cart Obj
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      // add to databas
      await prisma.cart.create({
        data: newCart,
      });
      // Revalidate product Page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name}Item added to cart`,
      };
    } else {
      // Check if item is already in the cart
      const existsItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existsItem) {
        //check the stock
        if (product.stock < existsItem.qty + 1) {
          throw new Error("Not enough stock");
        }
        // increase the qty
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existsItem.qty + 1;
      } else {
        // if item does not exist in cart
        // check the stock
        if (product.stock < 1) throw new Error("Not enough stock");

        // add item to cart.items
        cart.items.push(item);
      }
      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existsItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // check for the cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not Found");

  // Get session and user
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user Cart from databasen
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;

  // konverterar decimlar i return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // check for the cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not Found");

    // get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error(" Product or found");

    const cart = await getMyCart();
    if (!cart) throw new Error(" cart not found");

    // check for item
    const exist = (cart.items as CartItem[]).findLast(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    // check if only one in qty
    if (exist.qty === 1) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId! !== exist.productId
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;

      //Update cart in database

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
    }
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

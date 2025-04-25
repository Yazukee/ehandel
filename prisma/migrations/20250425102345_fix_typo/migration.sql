/*
  Warnings:

  - You are about to drop the `OderItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OderItem" DROP CONSTRAINT "OderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OderItem" DROP CONSTRAINT "OderItem_productId_fkey";

-- DropTable
DROP TABLE "OderItem";

-- CreateTable
CREATE TABLE "OrderItem" (
    "orderId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "orderitems_orderId_productId_pk" PRIMARY KEY ("orderId","productId")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

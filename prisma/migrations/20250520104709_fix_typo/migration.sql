-- AlterTable
ALTER TABLE "OrderItem" RENAME CONSTRAINT "orderItems_orderId_productId_pk" TO "orderitems_orderId_productId_pk";

-- RenameForeignKey
ALTER TABLE "OrderItem" RENAME CONSTRAINT "orderItems_orderId_order_id_fk" TO "orderitems_orderId_order_id_fk";

-- RenameForeignKey
ALTER TABLE "OrderItem" RENAME CONSTRAINT "orderItems_productId_product_id_fk" TO "orderitems_productId_product_id_fk";

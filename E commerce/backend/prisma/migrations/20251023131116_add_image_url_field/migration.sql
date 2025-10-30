/*
  Warnings:

  - You are about to drop the column `imagePlaceholder` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imagePlaceholder",
ADD COLUMN     "imageUrl" TEXT;

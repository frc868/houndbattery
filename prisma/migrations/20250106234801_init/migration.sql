/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Battery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Battery" DROP COLUMN "updatedAt",
ALTER COLUMN "status" DROP DEFAULT;

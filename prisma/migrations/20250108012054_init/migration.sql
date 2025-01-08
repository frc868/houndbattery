/*
  Warnings:

  - Added the required column `name2` to the `Battery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Battery" ADD COLUMN     "name2" TEXT NOT NULL;

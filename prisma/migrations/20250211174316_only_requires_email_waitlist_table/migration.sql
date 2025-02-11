/*
  Warnings:

  - You are about to drop the column `phone` on the `wait_list_table` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_role` on the `wait_list_table` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "wait_list_table_phone_key";

-- DropIndex
DROP INDEX "wait_list_table_preferred_role_key";

-- AlterTable
ALTER TABLE "wait_list_table" DROP COLUMN "phone",
DROP COLUMN "preferred_role";

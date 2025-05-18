/*
  Warnings:

  - Added the required column `updated_at` to the `user_links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_links" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" UUID,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" UUID;

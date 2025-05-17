/*
  Warnings:

  - You are about to drop the column `skillLevel` on the `application_skill_map` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `user_certificates` table. All the data in the column will be lost.
  - You are about to drop the column `skillLevel` on the `user_skillset` table. All the data in the column will be lost.
  - Added the required column `skill_level` to the `application_skill_map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skill_level` to the `user_skillset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "application_skill_map" RENAME COLUMN "skillLevel" TO "skill_level";

-- AlterTable
ALTER TABLE "user_certificates" RENAME COLUMN "filePath" TO "file_path";

-- AlterTable
ALTER TABLE "user_master" ADD COLUMN "profile_image" TEXT;

-- AlterTable
ALTER TABLE "user_skillset" RENAME COLUMN "skillLevel" TO "skill_level";
/*
  Warnings:

  - A unique constraint covering the columns `[user_id,skill_id]` on the table `user_skillset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_skillset_user_id_skill_id_key" ON "user_skillset"("user_id", "skill_id");

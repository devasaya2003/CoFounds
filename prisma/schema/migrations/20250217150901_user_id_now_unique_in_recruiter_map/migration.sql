/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `company_recruiter_map` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "company_recruiter_map_user_id_key" ON "company_recruiter_map"("user_id");

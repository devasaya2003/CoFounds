/*
  Warnings:

  - A unique constraint covering the columns `[user_id,job_id]` on the table `application_candidate_map` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,title]` on the table `user_certificates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,degree_id]` on the table `user_education` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,title]` on the table `user_projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "application_candidate_map_user_id_job_id_key" ON "application_candidate_map"("user_id", "job_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_certificates_user_id_title_key" ON "user_certificates"("user_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "user_education_user_id_degree_id_key" ON "user_education"("user_id", "degree_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_projects_user_id_title_key" ON "user_projects"("user_id", "title");

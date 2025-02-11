-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'candidate', 'recruiter');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('applied', 'under_review', 'rejected', 'inprogress', 'closed');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateTable
CREATE TABLE "wait_list_table" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,

    CONSTRAINT "wait_list_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_master" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "phone" TEXT,
    "user_name" TEXT,
    "dob" DATE,
    "role" "UserRole" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "degree_master" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "degree_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_master" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_master" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image" TEXT,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_master" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "size" INTEGER,
    "url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_recruiter_map" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_recruiter_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_candidate_map" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "assignment_link" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_candidate_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extra_questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extra_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extra_answers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "answer" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extra_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_skill_map" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "skill_id" UUID NOT NULL,
    "skillLevel" "SkillLevel" NOT NULL,
    "job_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_skill_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_application" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "recruiter_id" UUID NOT NULL,
    "requested_by" TEXT,
    "job_code" TEXT NOT NULL,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "job_description" TEXT,
    "package" DECIMAL(65,30),
    "assignment_link" TEXT,
    "end_at" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_education" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "degree_id" UUID NOT NULL,
    "end_at" DATE,
    "edu_from" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_experience" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "end_at" DATE,
    "company_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "end_at" DATE,
    "link" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skillset" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "skillLevel" "SkillLevel" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_skillset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wait_list_table_email_key" ON "wait_list_table"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_master_email_key" ON "user_master"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_master_phone_key" ON "user_master"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_master_user_name_key" ON "user_master"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "degree_master_name_key" ON "degree_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skill_master_name_key" ON "skill_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "resource_master_image_key" ON "resource_master"("image");

-- CreateIndex
CREATE UNIQUE INDEX "resource_master_title_key" ON "resource_master"("title");

-- CreateIndex
CREATE UNIQUE INDEX "resource_master_link_key" ON "resource_master"("link");

-- CreateIndex
CREATE UNIQUE INDEX "company_master_name_key" ON "company_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "company_master_url_key" ON "company_master"("url");

-- AddForeignKey
ALTER TABLE "company_recruiter_map" ADD CONSTRAINT "company_recruiter_map_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_recruiter_map" ADD CONSTRAINT "company_recruiter_map_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_candidate_map" ADD CONSTRAINT "application_candidate_map_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_candidate_map" ADD CONSTRAINT "application_candidate_map_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extra_questions" ADD CONSTRAINT "extra_questions_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extra_answers" ADD CONSTRAINT "extra_answers_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application_candidate_map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extra_answers" ADD CONSTRAINT "extra_answers_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extra_answers" ADD CONSTRAINT "extra_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "extra_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_skill_map" ADD CONSTRAINT "application_skill_map_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_skill_map" ADD CONSTRAINT "application_skill_map_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "job_application_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "job_application_recruiter_id_fkey" FOREIGN KEY ("recruiter_id") REFERENCES "user_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_education" ADD CONSTRAINT "user_education_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "degree_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_education" ADD CONSTRAINT "user_education_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_experience" ADD CONSTRAINT "user_experience_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skillset" ADD CONSTRAINT "user_skillset_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skillset" ADD CONSTRAINT "user_skillset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

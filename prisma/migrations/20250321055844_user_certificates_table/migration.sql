-- CreateTable
CREATE TABLE "user_certificates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "started_at" DATE,
    "end_at" DATE,
    "filePath" TEXT,
    "link" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_certificates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_certificates" ADD CONSTRAINT "user_certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

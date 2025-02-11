-- CreateTable
CREATE TABLE "wait_list_table" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "preferred_role" TEXT NOT NULL,

    CONSTRAINT "wait_list_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wait_list_table_email_key" ON "wait_list_table"("email");

-- CreateIndex
CREATE UNIQUE INDEX "wait_list_table_phone_key" ON "wait_list_table"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "wait_list_table_preferred_role_key" ON "wait_list_table"("preferred_role");

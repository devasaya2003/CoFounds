-- AlterTable
ALTER TABLE "wait_list_table" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mail_sended" BOOLEAN NOT NULL DEFAULT false;

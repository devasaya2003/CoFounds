-- CreateTable
CREATE TABLE "user_links" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "link_url" TEXT NOT NULL,
    "link_title" TEXT NOT NULL,

    CONSTRAINT "user_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_links_user_id_link_url_idx" ON "user_links"("user_id", "link_url");

-- AddForeignKey
ALTER TABLE "user_links" ADD CONSTRAINT "user_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

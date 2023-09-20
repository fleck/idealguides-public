/*
  Warnings:

  - You are about to drop the column `created_at` on the `embeds` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `embeds` table. All the data in the column will be lost.
  - You are about to drop the column `query_params` on the `embeds` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `embeds` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url,queryParams]` on the table `embeds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `embeds` table without a default value. This is not possible if the table is not empty.
  - Made the column `url` on table `embeds` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "embeds" DROP CONSTRAINT "embeds_item_id_fkey";

-- DropIndex
DROP INDEX "embeds_url_query_params_key";

-- DropIndex
DROP INDEX "index_embeds_on_item_id";

-- DropIndex
DROP INDEX "items_name";

-- AlterTable
ALTER TABLE "embeds" DROP COLUMN "created_at",
DROP COLUMN "item_id",
DROP COLUMN "query_params",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "itemId" INTEGER,
ADD COLUMN     "queryParams" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "url" SET NOT NULL;

-- CreateIndex
CREATE INDEX "index_embeds_on_item_id" ON "embeds"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "embeds_url_queryParams_key" ON "embeds"("url", "queryParams");

-- CreateIndex
CREATE INDEX "items_name" ON "items"("name");

-- AddForeignKey
ALTER TABLE "embeds" ADD CONSTRAINT "embeds_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

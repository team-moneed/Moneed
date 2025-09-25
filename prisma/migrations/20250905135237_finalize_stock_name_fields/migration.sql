/*
  Warnings:

  - You are about to drop the column `name` on the `stocks` table. All the data in the column will be lost.
  - Made the column `nameEn` on table `stocks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nameKo` on table `stocks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nation` on table `stocks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."stocks" DROP COLUMN "name",
ALTER COLUMN "nameEn" SET NOT NULL,
ALTER COLUMN "nameKo" SET NOT NULL,
ALTER COLUMN "nation" SET NOT NULL;

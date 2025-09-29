/*
  Warnings:

  - You are about to drop the column `token` on the `server_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenKey]` on the table `server_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenKey` to the `server_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenValue` to the `server_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "server_tokens_token_key";

-- AlterTable
ALTER TABLE "server_tokens" DROP COLUMN "token",
ADD COLUMN     "tokenKey" TEXT NOT NULL,
ADD COLUMN     "tokenValue" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "server_tokens_tokenKey_key" ON "server_tokens"("tokenKey");

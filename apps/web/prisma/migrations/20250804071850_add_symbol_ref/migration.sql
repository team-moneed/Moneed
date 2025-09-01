/*
  Warnings:

  - You are about to drop the column `stockId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `stockId` on the `selected_stocks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,stockSymbol]` on the table `selected_stocks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol]` on the table `stocks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stockSymbol` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockSymbol` to the `selected_stocks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_stockId_fkey";

-- DropForeignKey
ALTER TABLE "selected_stocks" DROP CONSTRAINT "selected_stocks_stockId_fkey";

-- DropIndex
DROP INDEX "selected_stocks_userId_stockId_key";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "stockId",
ADD COLUMN     "stockSymbol" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "selected_stocks" DROP COLUMN "stockId",
ADD COLUMN     "stockSymbol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "selected_stocks_userId_stockSymbol_key" ON "selected_stocks"("userId", "stockSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_symbol_key" ON "stocks"("symbol");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_stockSymbol_fkey" FOREIGN KEY ("stockSymbol") REFERENCES "stocks"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selected_stocks" ADD CONSTRAINT "selected_stocks_stockSymbol_fkey" FOREIGN KEY ("stockSymbol") REFERENCES "stocks"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

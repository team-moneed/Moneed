/*
  Warnings:

  - Made the column `nickname` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profileImage` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "nickname" SET NOT NULL,
ALTER COLUMN "profileImage" SET NOT NULL;

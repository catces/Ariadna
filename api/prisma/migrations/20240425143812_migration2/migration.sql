/*
  Warnings:

  - A unique constraint covering the columns `[mail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipality` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "municipality" TEXT NOT NULL,
ADD COLUMN     "streetNumber" TEXT NOT NULL,
ADD COLUMN     "streetType" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

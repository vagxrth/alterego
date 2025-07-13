/*
  Warnings:

  - Added the required column `userId` to the `OutputImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OutputImages" ADD CONSTRAINT "OutputImages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

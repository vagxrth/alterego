/*
  Warnings:

  - The values [Generated] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('Pending', 'Training', 'Completed', 'Failed');
ALTER TABLE "Model" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "OutputImages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Model" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "OutputImages" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Model" ALTER COLUMN "status" SET DEFAULT 'Pending';
ALTER TABLE "OutputImages" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

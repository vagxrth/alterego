-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "tensorPath" TEXT,
ADD COLUMN     "triggerWord" TEXT;

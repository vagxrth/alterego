-- CreateEnum
CREATE TYPE "ModelTrainingStatus" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "falAIRequestId" TEXT,
ADD COLUMN     "tensorPath" TEXT,
ADD COLUMN     "trainingStatus" "ModelTrainingStatus" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "triggerWord" TEXT;

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "falAIRequestId" TEXT;

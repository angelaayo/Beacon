/*
  Warnings:

  - Added the required column `organizationId` to the `Incident` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `IncidentEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `organizationId` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IncidentEventType" AS ENUM ('CREATED', 'STATUS_CHANGED', 'SEVERITY_CHANGED', 'USER_JOINED', 'USER_ASSIGNED', 'RESOLVED', 'ALERT_TRIGGERED');

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "resolvedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IncidentEvent" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "userId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "IncidentEventType" NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "joinCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_joinCode_key" ON "Organization"("joinCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentEvent" ADD CONSTRAINT "IncidentEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

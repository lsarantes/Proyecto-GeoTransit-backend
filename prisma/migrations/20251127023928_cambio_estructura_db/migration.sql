/*
  Warnings:

  - The primary key for the `Cooperativa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `codigoCoop` to the `Cooperativa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Cooperativa_Ruta" DROP CONSTRAINT "Cooperativa_Ruta_cooperativa_id_fkey";

-- AlterTable
ALTER TABLE "Cooperativa" DROP CONSTRAINT "Cooperativa_pkey",
ADD COLUMN     "codigoCoop" TEXT NOT NULL,
ADD CONSTRAINT "Cooperativa_pkey" PRIMARY KEY ("codigoCoop");

-- AddForeignKey
ALTER TABLE "Cooperativa_Ruta" ADD CONSTRAINT "Cooperativa_Ruta_cooperativa_id_fkey" FOREIGN KEY ("cooperativa_id") REFERENCES "Cooperativa"("codigoCoop") ON DELETE RESTRICT ON UPDATE CASCADE;

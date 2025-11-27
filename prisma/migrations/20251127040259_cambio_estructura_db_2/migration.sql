/*
  Warnings:

  - The primary key for the `Bahias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Ruta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Bahias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Ruta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Alertas" DROP CONSTRAINT "Alertas_ruta_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Cooperativa_Ruta" DROP CONSTRAINT "Cooperativa_Ruta_ruta_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pasajero" DROP CONSTRAINT "Pasajero_bahia_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."RutaBahia" DROP CONSTRAINT "RutaBahia_bahia_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."RutaBahia" DROP CONSTRAINT "RutaBahia_ruta_id_fkey";

-- AlterTable
ALTER TABLE "Bahias" DROP CONSTRAINT "Bahias_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Bahias_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Ruta" DROP CONSTRAINT "Ruta_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Ruta_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Pasajero" ADD CONSTRAINT "Pasajero_bahia_id_fkey" FOREIGN KEY ("bahia_id") REFERENCES "Bahias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperativa_Ruta" ADD CONSTRAINT "Cooperativa_Ruta_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutaBahia" ADD CONSTRAINT "RutaBahia_bahia_id_fkey" FOREIGN KEY ("bahia_id") REFERENCES "Bahias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutaBahia" ADD CONSTRAINT "RutaBahia_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alertas" ADD CONSTRAINT "Alertas_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

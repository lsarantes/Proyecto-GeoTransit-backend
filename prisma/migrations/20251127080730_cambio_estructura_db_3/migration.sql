-- DropForeignKey
ALTER TABLE "public"."Cooperativa" DROP CONSTRAINT "Cooperativa_id_encargado_fkey";

-- AlterTable
ALTER TABLE "Cooperativa" ALTER COLUMN "id_encargado" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Cooperativa" ADD CONSTRAINT "Cooperativa_id_encargado_fkey" FOREIGN KEY ("id_encargado") REFERENCES "Encargado_Cooperativa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "TD_Alerta" AS ENUM ('Accidente', 'Desvio', 'Falla_mecanica', 'Policia', 'Trafico');

-- CreateEnum
CREATE TYPE "TD_Estado_Bus" AS ENUM ('ACTIVO', 'EN_MANTENIMIENDO', 'FUERA_DE_SERVICIO');

-- CreateEnum
CREATE TYPE "TD_Estado_Ubicacion" AS ENUM ('ACTUAL', 'ULTIMA_CONOCIDA', 'DESCONOCIDA');

-- CreateEnum
CREATE TYPE "TD_NivelAcceso" AS ENUM ('Administrador', 'Gestor_de_cooperativas_y_encargados', 'Gestor_de_rutas', 'Gestor_de_bahias');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PASAJERO', 'CONDUCTORES', 'GESTOR_DE_RUTAS', 'EMPLEADO_MTI', 'ENCARGADO_COOPERATIVA', 'GESTOR_BAHIAS_MTI');

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "primer_nombre" TEXT NOT NULL,
    "segundo_nombre" TEXT,
    "tercer_nombre" TEXT,
    "primer_apellido" TEXT NOT NULL,
    "segundo_apellido" TEXT,
    "cod_pais" TEXT,
    "url_Foto" TEXT,
    "fecha_de_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizada" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PASAJERO',

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telefono" (
    "id" SERIAL NOT NULL,
    "no_telefonico" TEXT NOT NULL,
    "compania" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,

    CONSTRAINT "Telefono_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id_usuario" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "f_ultimo_acceso" TIMESTAMP(3) NOT NULL,
    "esta_activo" BOOLEAN NOT NULL DEFAULT false,
    "persona_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Conductor" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,

    CONSTRAINT "Conductor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bus" (
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "velocidad" DOUBLE PRECISION NOT NULL,
    "capacidad_de_pasajeros" INTEGER NOT NULL,
    "latitud_actual" DOUBLE PRECISION NOT NULL,
    "longitud_actual" DOUBLE PRECISION NOT NULL,
    "fecha_hora_ultima_ubicacion" TIMESTAMP(3) NOT NULL,
    "estado_ubicacion" "TD_Estado_Ubicacion" NOT NULL,
    "estado_bus" "TD_Estado_Bus" NOT NULL,
    "conductor_id" TEXT NOT NULL,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("placa")
);

-- CreateTable
CREATE TABLE "Encargado_Cooperativa" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,

    CONSTRAINT "Encargado_Cooperativa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado_MTI" (
    "id_empleado_mti" TEXT NOT NULL,
    "nivel_acceso" "TD_NivelAcceso" NOT NULL,
    "persona_id" TEXT NOT NULL,

    CONSTRAINT "Empleado_MTI_pkey" PRIMARY KEY ("id_empleado_mti")
);

-- CreateTable
CREATE TABLE "Pasajero" (
    "id_pasajero" TEXT NOT NULL,
    "bahia_origen" TEXT NOT NULL,
    "bahia_destino" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "bahia_id" TEXT NOT NULL,

    CONSTRAINT "Pasajero_pkey" PRIMARY KEY ("id_pasajero")
);

-- CreateTable
CREATE TABLE "Cooperativa" (
    "nombre_cooperativa" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "cod_pais" TEXT NOT NULL,
    "latitud_ubicacion" DOUBLE PRECISION NOT NULL,
    "logitud_ubicacion" DOUBLE PRECISION NOT NULL,
    "no_telefonico" INTEGER NOT NULL,
    "url_foto_perfil" TEXT NOT NULL,
    "fecha_de_creacion" TIMESTAMP(3) NOT NULL,
    "id_encargado" TEXT NOT NULL,

    CONSTRAINT "Cooperativa_pkey" PRIMARY KEY ("nombre_cooperativa")
);

-- CreateTable
CREATE TABLE "Ruta" (
    "nombre_ruta" TEXT NOT NULL,
    "origen_latitud" DOUBLE PRECISION NOT NULL,
    "origen_longitud" DOUBLE PRECISION NOT NULL,
    "destino_latitud" DOUBLE PRECISION NOT NULL,
    "destino_longitud" DOUBLE PRECISION NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("nombre_ruta")
);

-- CreateTable
CREATE TABLE "Cooperativa_Ruta" (
    "cooperativa_id" TEXT NOT NULL,
    "ruta_id" TEXT NOT NULL,

    CONSTRAINT "Cooperativa_Ruta_pkey" PRIMARY KEY ("cooperativa_id","ruta_id")
);

-- CreateTable
CREATE TABLE "Bahias" (
    "nombre_bahia" TEXT NOT NULL,
    "ubicacion_latitud" DOUBLE PRECISION NOT NULL,
    "ubicacion_longitud" DOUBLE PRECISION NOT NULL,
    "url_foto" TEXT NOT NULL,
    "fecha_creada" TIMESTAMP(3) NOT NULL,
    "empleado_mti_id" TEXT NOT NULL,

    CONSTRAINT "Bahias_pkey" PRIMARY KEY ("nombre_bahia")
);

-- CreateTable
CREATE TABLE "RutaBahia" (
    "ruta_id" TEXT NOT NULL,
    "bahia_id" TEXT NOT NULL,

    CONSTRAINT "RutaBahia_pkey" PRIMARY KEY ("ruta_id","bahia_id")
);

-- CreateTable
CREATE TABLE "Alertas" (
    "id_alerta" TEXT NOT NULL,
    "tipo_alerta" "TD_Alerta" NOT NULL,
    "ruta_id" TEXT NOT NULL,

    CONSTRAINT "Alertas_pkey" PRIMARY KEY ("id_alerta")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_persona_id_key" ON "User"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "Conductor_persona_id_key" ON "Conductor"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "Encargado_Cooperativa_persona_id_key" ON "Encargado_Cooperativa"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_MTI_persona_id_key" ON "Empleado_MTI"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pasajero_persona_id_key" ON "Pasajero"("persona_id");

-- AddForeignKey
ALTER TABLE "Telefono" ADD CONSTRAINT "Telefono_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conductor" ADD CONSTRAINT "Conductor_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "Conductor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encargado_Cooperativa" ADD CONSTRAINT "Encargado_Cooperativa_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado_MTI" ADD CONSTRAINT "Empleado_MTI_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pasajero" ADD CONSTRAINT "Pasajero_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pasajero" ADD CONSTRAINT "Pasajero_bahia_id_fkey" FOREIGN KEY ("bahia_id") REFERENCES "Bahias"("nombre_bahia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperativa" ADD CONSTRAINT "Cooperativa_id_encargado_fkey" FOREIGN KEY ("id_encargado") REFERENCES "Encargado_Cooperativa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperativa_Ruta" ADD CONSTRAINT "Cooperativa_Ruta_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "Ruta"("nombre_ruta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooperativa_Ruta" ADD CONSTRAINT "Cooperativa_Ruta_cooperativa_id_fkey" FOREIGN KEY ("cooperativa_id") REFERENCES "Cooperativa"("nombre_cooperativa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bahias" ADD CONSTRAINT "Bahias_empleado_mti_id_fkey" FOREIGN KEY ("empleado_mti_id") REFERENCES "Empleado_MTI"("id_empleado_mti") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutaBahia" ADD CONSTRAINT "RutaBahia_bahia_id_fkey" FOREIGN KEY ("bahia_id") REFERENCES "Bahias"("nombre_bahia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutaBahia" ADD CONSTRAINT "RutaBahia_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "Ruta"("nombre_ruta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alertas" ADD CONSTRAINT "Alertas_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "Ruta"("nombre_ruta") ON DELETE RESTRICT ON UPDATE CASCADE;

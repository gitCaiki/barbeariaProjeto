-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('agendado', 'em_andamento', 'finalizado', 'cancelado');

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "duracao" INTEGER NOT NULL,
    "descricao" TEXT,
    "imagem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" UUID NOT NULL,
    "cliente" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "servicoId" UUID NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'agendado',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barber" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Barber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Appointment_startsAt_idx" ON "Appointment"("startsAt");

-- CreateIndex
CREATE INDEX "Appointment_servicoId_idx" ON "Appointment"("servicoId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_startsAt_key" ON "Appointment"("startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "Barber_username_key" ON "Barber"("username");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

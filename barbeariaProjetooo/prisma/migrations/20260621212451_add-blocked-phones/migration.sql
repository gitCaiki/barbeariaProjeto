-- CreateTable
CREATE TABLE "Bloqueado" (
    "id" UUID NOT NULL,
    "telefone" TEXT NOT NULL,
    "bloqueadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,
    "userId" UUID,

    CONSTRAINT "Bloqueado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bloqueado_telefone_key" ON "Bloqueado"("telefone");

-- CreateIndex
CREATE INDEX "Bloqueado_telefone_idx" ON "Bloqueado"("telefone");

-- AddForeignKey
ALTER TABLE "Bloqueado" ADD CONSTRAINT "Bloqueado_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Barber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

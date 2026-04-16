/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_nome_key" ON "Service"("nome");

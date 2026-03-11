-- CreateTable
CREATE TABLE "Empreendimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "empreendedor" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "segmento" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Municipio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Municipio_nome_key" ON "Municipio"("nome");

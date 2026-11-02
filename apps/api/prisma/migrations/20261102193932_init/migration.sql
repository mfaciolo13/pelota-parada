-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "torneos" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "torneos_pkey" PRIMARY KEY ("id")
);


-- Supabase expone el esquema public por su API con la clave publica.
-- Sin politicas, RLS deja la tabla inaccesible por esa via; la API accede con Prisma.
ALTER TABLE "torneos" ENABLE ROW LEVEL SECURITY;

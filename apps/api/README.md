# @potrero/api

API del backend. Node.js + TypeScript con Express y Zod.

## Cómo levantarla

Requisitos: Node.js 22.9 o superior y un proyecto de Supabase (ver más abajo). Desde la raíz del repo:

```sh
npm install
cp apps/api/.env.example apps/api/.env   # y completá DATABASE_URL con tu conexión de Supabase
npm run dev --workspace @potrero/api
```

## Base de datos (Supabase)

La API usa Postgres alojado en [Supabase](https://supabase.com). No hace falta instalar nada local.

1. Usá el proyecto de Supabase del equipo. Es el único entorno del proyecto: funciona como desarrollo y QA, y no hay un entorno de producción separado. Todo el equipo comparte la misma base.
2. En el proyecto, abrí **Connect** y copiá la cadena de conexión del **Transaction pooler**.
3. Pegala en `DATABASE_URL` dentro de `apps/api/.env`, con tu contraseña de base de datos.

El archivo `.env` está ignorado por git. No subas nunca esa cadena al repo: incluye la contraseña de la base.

## Prisma y migraciones

La API accede a la base con [Prisma](https://www.prisma.io) 7. El schema está en [prisma/schema.prisma](prisma/schema.prisma) y las migraciones en `prisma/migrations/`. El cliente se genera en `src/generated/` (ignorado por git) al correr `npm install`.

- **`DATABASE_URL`** (Transaction pooler) la usa la API en ejecución.
- **`DIRECT_URL`** (conexión directa) la usa solo el CLI de Prisma para migrar. Copiala de **Connect → Direct connection** y guardala en `apps/api/.env`. Si tu red no tiene IPv6, usá la del Session pooler.

| Script | Qué hace |
| --- | --- |
| `db:generate` | Regenera el cliente de Prisma después de cambiar el schema |
| `db:migrate` | Crea y aplica una migración en desarrollo (`prisma migrate dev`) |
| `db:deploy` | Aplica las migraciones pendientes sin crear nuevas (`prisma migrate deploy`) |

Como la base es compartida, cuidá estos puntos:

- Las migraciones se aplican una sola vez, desde `main` y con `db:deploy`. No apliques migraciones de una rama sin mergear.
- `db:migrate` (`prisma migrate dev`) puede proponer **resetear la base** si detecta diferencias con las migraciones. Nunca aceptes el reset: borraría los datos de todo el equipo.
- No edites una migración que ya está en `main`. Si hay que corregir algo, se crea una migración nueva.

Cada tabla que se cree debe habilitar RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). Supabase expone el esquema `public` por su API con la clave pública, y sin RLS cualquiera con esa clave podría leer y escribir la tabla. La API no se ve afectada, porque accede con Prisma por la conexión de Postgres.

## Scripts

| Script | Qué hace |
| --- | --- |
| `dev` | Levanta la API y reinicia al guardar cambios |
| `build` | Compila TypeScript a `dist/` |
| `start` | Corre la versión compilada (`build` antes) |
| `typecheck` | Chequea los tipos sin generar archivos |

## Endpoints

| Método | Ruta | Respuesta |
| --- | --- | --- |
| `GET` | `/health` | `200` con `{ "status": "ok" }` cuando la API está arriba |
| `GET` | `/health/db` | `200` con `{ "status": "ok", "db": "ok" }` si la base responde, `503` si no |

## Variables de entorno

Se validan con Zod al arrancar. Si alguna es inválida, la API no levanta.

| Variable | Default | Descripción |
| --- | --- | --- |
| `PORT` | `3000` | Puerto en el que escucha |
| `DATABASE_URL` | sin valor | Cadena de conexión a Postgres en Supabase (`postgresql://usuario:clave@host:puerto/base`). Obligatoria |
| `DIRECT_URL` | sin valor | Conexión directa de Supabase. Solo la usa el CLI de Prisma para migrar, la API no la lee |

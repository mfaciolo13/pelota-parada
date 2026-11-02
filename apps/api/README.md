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

1. Creá un proyecto de Supabase. Conviene uno para desarrollo y otro distinto para producción, así los cambios de desarrollo no tocan datos reales.
2. En el proyecto, abrí **Connect** y copiá la cadena de conexión del **Transaction pooler**.
3. Pegala en `DATABASE_URL` dentro de `apps/api/.env`, con tu contraseña de base de datos.

El archivo `.env` está ignorado por git. No subas nunca esa cadena al repo: incluye la contraseña de la base.

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

## Variables de entorno

Se validan con Zod al arrancar. Si alguna es inválida, la API no levanta.

| Variable | Default | Descripción |
| --- | --- | --- |
| `PORT` | `3000` | Puerto en el que escucha |
| `DATABASE_URL` | sin valor | Cadena de conexión a Postgres en Supabase (`postgresql://usuario:clave@host:puerto/base`). Obligatoria |

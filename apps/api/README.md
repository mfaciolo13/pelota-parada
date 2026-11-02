# @potrero/api

API del backend. Node.js + TypeScript con Express y Zod.

## Cómo levantarla

Requisitos: Node.js 22.9 o superior. Desde la raíz del repo:

```sh
npm install
cp apps/api/.env.example apps/api/.env   # opcional: sin .env usa los valores por defecto
npm run dev --workspace @potrero/api
```

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

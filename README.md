# pelota-parada

App para organizar torneos de fútbol amateur: inscripción de equipos, fixture automático todos contra todos, canchas y resultados de partidos.

## Estructura del monorepo

| Carpeta | Contenido |
| --- | --- |
| `apps/mobile` | App móvil (`@pelota-parada/mobile`) |
| `apps/api` | API del backend (`@pelota-parada/api`) |
| `packages/domain` | Lógica de dominio compartida (`@pelota-parada/domain`) |
| `docs` | Documentación técnica y de la tesis |

Es un monorepo con [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces). Los paquetes de `apps/` y `packages/` se declaran en el `package.json` de la raíz.

## Cómo levantar el proyecto

Requisitos: Node.js 20 o superior y npm.

```sh
git clone git@github.com:mfaciolo13/pelota-parada.git
cd pelota-parada
git config core.hooksPath .githooks   # activa los hooks de commits y ramas
npm install                           # instala las dependencias de todos los workspaces
```

Los paquetes todavía no tienen código ni scripts. Los comandos para correr la app y la API se agregan junto con cada paquete.

Para cualquier comando dentro de un paquete:

```sh
npm run <script> --workspace @pelota-parada/<paquete>
```

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de trabajo y las convenciones de ramas y commits.

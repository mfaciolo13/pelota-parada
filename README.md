# potrero

App para organizar torneos de fútbol amateur: inscripción de equipos, fixture automático todos contra todos, canchas y resultados de partidos.

## Estructura del monorepo

| Carpeta | Contenido |
| --- | --- |
| `apps/mobile` | App móvil (`@potrero/mobile`) |
| `apps/api` | API del backend (`@potrero/api`) |
| `packages/domain` | Lógica de dominio compartida (`@potrero/domain`) |
| `docs` | Documentación técnica y de la tesis |

Es un monorepo con [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces). Los paquetes de `apps/` y `packages/` se declaran en el `package.json` de la raíz.

## Cómo levantar el proyecto

Requisitos: Node.js 20 o superior y npm.

```sh
git clone git@github.com:mfaciolo13/potrero.git
cd potrero
git config core.hooksPath .githooks   # activa los hooks de commits y ramas
npm install                           # instala las dependencias de todos los workspaces
```

Para correr cada paquete:

- App móvil: `npm run start --workspace @potrero/mobile`
- API: ver [apps/api/README.md](apps/api/README.md)

Para cualquier comando dentro de un paquete:

```sh
npm run <script> --workspace @potrero/<paquete>
```

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de trabajo y las convenciones de ramas y commits.

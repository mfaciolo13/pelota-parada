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

## Lint, tipos y tests

Desde la raíz corren en todos los paquetes:

```sh
npm run lint        # ESLint
npm run typecheck   # TypeScript sin generar archivos
npm run test        # Vitest
```

Cada paquete expone los mismos tres scripts, así que también se pueden correr de a uno:

```sh
npm run lint --workspace @potrero/api
```

- ESLint usa la configuración de la raíz (`eslint.config.mjs`). `apps/mobile` tiene la suya, que suma las reglas de Expo.
- Los tests usan [Vitest](https://vitest.dev). Mientras un paquete no tenga tests, `npm run test` pasa sin correr nada.

Para cualquier comando dentro de un paquete:

```sh
npm run <script> --workspace @potrero/<paquete>
```

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de trabajo y las convenciones de ramas y commits.

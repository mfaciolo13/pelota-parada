# Guía de contribución

## Flujo de trabajo

1. Todo trabajo arranca desde un issue (historia de usuario o bug).
2. Se crea una rama desde `main` con el número del issue en el nombre.
3. Se abre un pull request hacia `main` usando el template.
4. El PR necesita al menos una aprobación para mergearse. No se puede pushear directo a `main`.

## Convención de ramas

```
<tipo>/<N>-<descripcion-corta>
```

- `tipo`: `feat`, `fix`, `docs`, `refactor`, `test` o `chore`
- `N`: número del issue de GitHub
- `descripcion-corta`: minúsculas, números y guiones

Ejemplos: `feat/12-fixture-automatico`, `fix/34-resultado-duplicado`

## Convención de commits

Basada en [Conventional Commits](https://www.conventionalcommits.org/es/):

```
<tipo>(<alcance opcional>): <descripción>
```

- Mismos tipos que las ramas.
- Descripción en minúscula, sin punto final, hasta 72 caracteres.
- El número de issue `(#N)` se agrega automáticamente desde el nombre de la rama. No hace falta escribirlo.

Ejemplos:

```
feat(fixture): generar partidos todos contra todos
fix(equipos): evitar inscripción duplicada
docs: agregar guía de contribución
```

## Activar los hooks (una vez por clon)

Los hooks que validan ramas y commits viven en `.githooks/`. Para activarlos:

```sh
git config core.hooksPath .githooks
```

Qué hacen:

- `commit-msg`: valida el formato del mensaje, rechaza commits en ramas sin issue y agrega `(#N)` al final de la primera línea.
- `pre-push`: rechaza el push de ramas que no sigan la convención.

Si un commit o push es rechazado, el mensaje de error indica qué corregir.

## Validación en cada pull request

Los hooks locales se pueden saltear con `--no-verify`, así que GitHub Actions repite la validación en cada PR con el workflow [validar-nombres.yml](.github/workflows/validar-nombres.yml):

- El nombre de la rama debe seguir `<tipo>/<N>-<descripcion>`.
- Todos los commits del PR deben seguir `<tipo>(<alcance opcional>): <descripcion>`.
- Los commits de merge, `revert`, `fixup!` y `squash!` se ignoran, igual que en los hooks.
- Los PRs creados por bots no se validan.

El check **Validar ramas y commits** es requerido para mergear a `main`. La lógica está en [.github/scripts/validar-nombres.sh](.github/scripts/validar-nombres.sh) y debe mantenerse sincronizada con los hooks de `.githooks/`.

## CI en cada pull request

El workflow [ci.yml](.github/workflows/ci.yml) corre lint, chequeo de tipos y tests, pero solo de los paquetes que el PR afecta:

| Si el PR toca | Se verifica |
| --- | --- |
| `apps/api` | api |
| `apps/mobile` | mobile |
| `packages/domain` | api, mobile y domain, porque dependen de él |
| `package.json` o `package-lock.json` de la raíz, `eslint.config.mjs` o la propia CI | api, mobile y domain |
| solo `docs/` u otros archivos | nada |

Las reglas están en [.github/scripts/paquetes-afectados.sh](.github/scripts/paquetes-afectados.sh). Para correr lo mismo en local:

```sh
npm run lint && npm run typecheck && npm run test
```

El check **CI** es el único requerido en `main`. Falla si falla cualquier paquete verificado y pasa si no hubo nada que verificar. Al agregar un paquete nuevo hay que sumarlo al script y al filtro del workflow, pero no a la protección de `main`.

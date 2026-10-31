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

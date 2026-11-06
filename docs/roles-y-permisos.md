# Roles y permisos

Los roles salen del informe inicial. Este documento define dónde vive cada uno, cómo se obtiene y cómo lo exige la API.

## Los siete roles

| Rol | Se guarda | Cómo se obtiene |
| --- | --- | --- |
| Visitante | No | No tiene cuenta ni token. Solo lee lo público (RN-20). |
| Usuario | No | Tiene cuenta y token, pero `users.role` está vacío. Todavía no eligió rol (RF-05). |
| Jugador | `users.role = PLAYER` | Elige ser jugador al terminar el alta. |
| Capitán | No | Es un jugador que figura en `teams.captain_id`. Se deriva, no se guarda. |
| Organizador | `users.role = ORGANIZER` | El admin aprueba su solicitud (RF-07, RF-08). |
| Árbitro | `users.role = REFEREE` | Acepta un link de invitación de un organizador (RF-18, RF-36). |
| Admin | `users.role = ADMIN` | Se asigna a mano, ver abajo. |

El rol se guarda en una sola columna, `users.role`, con los valores `PLAYER`, `ORGANIZER`, `REFEREE` y `ADMIN`. Una persona tiene un solo rol a la vez. El organizador no juega en torneos (RN-17), así que no necesita ser jugador al mismo tiempo.

## Cómo se asigna el admin

El admin nunca se asigna desde la app ni desde un endpoint. Lo hace una persona del equipo con acceso a la base de Supabase, y solo después de que la cuenta existe:

1. La persona inicia sesión una vez. Eso crea su fila en `users` (#84).
2. Quien tiene acceso copia su id desde Authentication en Supabase y corre en el SQL Editor:

```sql
UPDATE users SET role = 'ADMIN' WHERE id = '<id de auth.users>';
```

Para quitarlo, el mismo comando con el rol que corresponda, o `NULL`.

Los endpoints que cambian roles tienen que respetar estos límites:

- Elegir rol (RF-05) solo acepta `PLAYER`. Quien elige organizador queda con su rol actual hasta que el admin apruebe la solicitud.
- Nada que reciba un rol desde el cliente puede escribir `ADMIN`.
- El rol `REFEREE` solo se asigna al aceptar una invitación válida.

## Cómo lo exige la API

`requireRole` está en [apps/api/src/auth.ts](../apps/api/src/auth.ts). Es un middleware de Express que recibe los roles permitidos:

```ts
app.post("/tournaments", requireRole("ORGANIZER"), createTournament);
app.get("/admin/requests", requireRole("ADMIN"), listRequests);
```

| Situación | Respuesta |
| --- | --- |
| No hay usuario autenticado | 401 |
| El usuario no tiene rol o el suyo no está entre los permitidos | 403 |
| El rol está permitido | Sigue al endpoint |

Algunas reglas a tener en cuenta:

- El admin no hereda permisos de otros roles. Si un endpoint también es para él, hay que listarlo: `requireRole("ORGANIZER", "ADMIN")`.
- El capitán no se exige con `requireRole`, porque depende del equipo concreto. Cada endpoint de equipos comprueba que el usuario sea `captain_id` de ese equipo.
- El middleware lee `req.user`. Quien lo llena con el usuario autenticado y su rol es la validación del token de Supabase (#84).

## Puntos abiertos

1. **Un rol por persona.** Si un organizador quisiera jugar un torneo de otro organizador, el modelo actual no lo permite. El informe lo excluye para el organizador, pero no dice nada del árbitro.
2. **Organizador sin aprobar.** Mientras la solicitud está pendiente, la persona conserva su rol anterior. Hay que decidir si debería poder crear un equipo o postularse.

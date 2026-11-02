#!/usr/bin/env bash
# Decide que paquetes tiene que verificar la CI segun las carpetas que cambio el PR.
# Entrada (variables de entorno, "true" o "false"): COMUN, DOMAIN, API, MOBILE.
# Salida: lista JSON de paquetes, por ejemplo ["api","mobile"].
#
# Reglas:
#   - COMUN (lockfile, package.json raiz, config de lint, CI): se verifica todo.
#   - DOMAIN: lo usan la API y la app, asi que se verifica todo.
#   - API o MOBILE: solo ese paquete.
#   - Solo docs u otros archivos: ningun paquete.

set -eu

paquetes=()

if [ "${COMUN:-false}" = "true" ] || [ "${DOMAIN:-false}" = "true" ]; then
  paquetes=(api mobile domain)
else
  [ "${API:-false}" = "true" ] && paquetes+=(api)
  [ "${MOBILE:-false}" = "true" ] && paquetes+=(mobile)
fi

if [ ${#paquetes[@]} -eq 0 ]; then
  echo '[]'
else
  json=$(printf '"%s",' "${paquetes[@]}")
  echo "[${json%,}]"
fi

#!/usr/bin/env bash
# Valida el nombre de la rama y el formato de los commits de un PR.
# Uso: validar-nombres.sh <rama>
# Recibe por stdin la primera linea de cada commit, una por linea.
# Mantener sincronizado con los hooks de .githooks/.

set -u

TIPOS='feat|fix|docs|refactor|test|chore'
RAMA_RE="^($TIPOS)/[0-9]+-[a-z0-9-]+\$"
COMMIT_RE="^($TIPOS)(\([a-z0-9._/-]+\))?!?: [^ A-Z].{0,71}( \(#[0-9]+\))?\$"

rama="${1:-}"
errores=0

if ! [[ $rama =~ $RAMA_RE ]]; then
  echo "::error::La rama '$rama' no sigue la convencion <tipo>/<N>-<descripcion> (ej: feat/12-fixture-automatico). Tipos: ${TIPOS//|/, }."
  errores=1
fi

total=0
while IFS= read -r linea; do
  linea="${linea%$'\r'}"
  [ -z "$linea" ] && continue
  case "$linea" in
    "Merge "*|"Revert "*|"fixup! "*|"squash! "*) continue ;;
  esac
  total=$((total + 1))
  if ! [[ $linea =~ $COMMIT_RE ]]; then
    echo "::error::Commit con formato invalido: '$linea'. Esperado: <tipo>(<alcance opcional>): <descripcion en minuscula, hasta 72 caracteres>."
    errores=1
  fi
done

echo "Rama: $rama. Commits revisados: $total. Errores: $errores."
exit $errores

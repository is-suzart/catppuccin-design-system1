#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ARTIFACTS_DIR="${CODEQL_ARTIFACTS_DIR:-$ROOT_DIR/.artifacts/codeql}"
LANGUAGE="${CODEQL_LANGUAGE:-javascript-typescript}"
QUERY_SUITE="${CODEQL_QUERY_SUITE:-javascript-security-and-quality.qls}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
RESULT_FILE="$ARTIFACTS_DIR/codeql-results-$TIMESTAMP.sarif"
TMP_PARENT="$(mktemp -d "${TMPDIR:-/tmp}/catppuccin-codeql.XXXXXX")"
DB_DIR="$TMP_PARENT/database"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

cleanup() {
  if [ -d "$TMP_PARENT" ]; then
    rm -rf "$TMP_PARENT"
    echo -e "${CYAN}[cleanup] Banco temporario do CodeQL removido.${NC}"
  fi
}
trap cleanup EXIT

resolve_query_suite() {
  local suite="$1"

  if [ -f "$suite" ] || [ -d "$suite" ] || [[ "$suite" == *:* ]]; then
    printf '%s\n' "$suite"
    return 0
  fi

  case "$LANGUAGE" in
    javascript|javascript-typescript|typescript)
      printf 'codeql/javascript-queries:codeql-suites/%s\n' "$suite"
      ;;
    python)
      printf 'codeql/python-queries:codeql-suites/%s\n' "$suite"
      ;;
    ruby)
      printf 'codeql/ruby-queries:codeql-suites/%s\n' "$suite"
      ;;
    go)
      printf 'codeql/go-queries:codeql-suites/%s\n' "$suite"
      ;;
    java|java-kotlin)
      printf 'codeql/java-queries:codeql-suites/%s\n' "$suite"
      ;;
    c|cpp|c-cpp)
      printf 'codeql/cpp-queries:codeql-suites/%s\n' "$suite"
      ;;
    csharp)
      printf 'codeql/csharp-queries:codeql-suites/%s\n' "$suite"
      ;;
    swift)
      printf 'codeql/swift-queries:codeql-suites/%s\n' "$suite"
      ;;
    rust)
      printf 'codeql/rust-queries:codeql-suites/%s\n' "$suite"
      ;;
    *)
      printf '%s\n' "$suite"
      ;;
  esac
}

if ! command -v codeql >/dev/null 2>&1; then
  echo -e "${RED}[error] CodeQL nao encontrado no PATH.${NC}"
  echo "  Instale o bundle oficial ou use o GitHub CLI com a extensao gh-codeql."
  echo "  Depois confirme com: codeql version"
  exit 1
fi

RESOLVED_QUERY_SUITE="$(resolve_query_suite "$QUERY_SUITE")"

mkdir -p "$ARTIFACTS_DIR"

echo -e "${CYAN}Catppuccin DS - Security Scan (CodeQL)${NC}"
echo "--------------------------------------"
echo "Linguagem: $LANGUAGE"
echo "Suite:     $RESOLVED_QUERY_SUITE"
echo "Saida:     $RESULT_FILE"
echo ""

echo -e "${CYAN}[1/2] Criando banco temporario do CodeQL...${NC}"
# O diretorio do banco nao pode existir previamente, por isso usamos um pai temporario.
codeql database create "$DB_DIR" \
  --language="$LANGUAGE" \
  --source-root="$ROOT_DIR"
echo -e "${GREEN}[ok] Banco criado com sucesso.${NC}"
echo ""

echo -e "${CYAN}[2/2] Rodando analise security-and-quality...${NC}"
codeql database analyze "$DB_DIR" \
  --format=sarif-latest \
  --output="$RESULT_FILE" \
  "$RESOLVED_QUERY_SUITE"
echo -e "${GREEN}[ok] Analise concluida.${NC}"
echo ""

echo -e "${GREEN}Resultado SARIF gerado em:${NC}"
echo "  $RESULT_FILE"
echo ""
echo -e "${YELLOW}Dica:${NC} abra o arquivo em um viewer de SARIF ou envie para o code scanning do GitHub."

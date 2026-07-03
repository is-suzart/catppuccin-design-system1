#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Catppuccin Design System — Security Scan (Trivy)
# ─────────────────────────────────────────────────────────
# Trivy não suporta bun.lock, então geramos um yarn.lock
# temporário para o scan e removemos ao final.
# ─────────────────────────────────────────────────────────

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
YARN_LOCK="$ROOT_DIR/yarn.lock"
GENERATED_LOCK=false

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

cleanup() {
  if [ "$GENERATED_LOCK" = true ] && [ -f "$YARN_LOCK" ]; then
    rm -f "$YARN_LOCK"
    echo -e "${CYAN}🧹 yarn.lock temporário removido.${NC}"
  fi
}
trap cleanup EXIT

# ── Verificar se o Trivy está instalado ──
if ! command -v trivy &> /dev/null; then
  echo -e "${RED}❌ Trivy não encontrado. Instale com:${NC}"
  echo "   Arch: sudo pacman -S trivy"
  echo "   Brew: brew install trivy"
  exit 1
fi

echo -e "${CYAN}🔒 Catppuccin DS — Security Scan${NC}"
echo "─────────────────────────────────────"

# ── Gerar yarn.lock temporário se não existir ──
if [ ! -f "$YARN_LOCK" ]; then
  echo -e "${YELLOW}⚠  bun.lock detectado. Gerando yarn.lock temporário para o Trivy...${NC}"
  cd "$ROOT_DIR"
  yarn install --ignore-scripts --no-immutable 2>/dev/null || yarn install 2>/dev/null
  GENERATED_LOCK=true
  echo -e "${GREEN}✔  yarn.lock gerado.${NC}"
  echo ""
fi

# ── Scan de produção ──
echo -e "${CYAN}📦 Scan de dependências de produção:${NC}"
trivy fs --scanners vuln --skip-version-check "$ROOT_DIR"
echo ""

# ── Scan incluindo dev dependencies ──
echo -e "${CYAN}🔧 Scan incluindo dependências de desenvolvimento:${NC}"
trivy fs --scanners vuln --include-dev-deps --skip-version-check "$ROOT_DIR"

#!/bin/bash
set -euo pipefail

VERSION=""
COMMIT_MSG=""
AUTO_Y=0
SKIP_LINT=0
SKIP_COMMIT=0
BRANCH=""

while [ $# -gt 0 ]; do
  case "$1" in
    -v|--version) VERSION="$2"; shift 2;;
    -m|--message) COMMIT_MSG="$2"; shift 2;;
    -y|--yes) AUTO_Y=1; shift;;
    --skip-lint) SKIP_LINT=1; shift;;
    --skip-commit) SKIP_COMMIT=1; shift;;
    --push-branch) BRANCH="$2"; shift 2;;
    *) break;;
  esac
done

echo "🔧 Processo de Release - Início"
echo "📦 Repositório: Nk_Land_One (landing ONE NorthKeep)"

LAST_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -n "$LAST_VERSION" ]; then
  echo "🕘 Última versão encontrada: $LAST_VERSION"
else
  echo "⚠️ Nenhuma versão anterior encontrada."
fi

if [ -z "$VERSION" ]; then
  read -p "Informe a nova versão (ex.: v2.1.0): " VERSION
fi

if git tag -l "$VERSION" | grep -q "^$VERSION$"; then
  echo "❌ Tag $VERSION já existe. Abortando."
  exit 1
fi

if [ "$AUTO_Y" -eq 0 ]; then
  read -p "⚠️ Confirma criar a versão $VERSION? (s/n): " CONFIRM
  if [ "$CONFIRM" != "s" ]; then
    echo "❌ Operação cancelada."
    exit 1
  fi
fi

if [ -z "$COMMIT_MSG" ]; then
  read -p "📝 Informe a mensagem de commit (ou deixe em branco para padrão): " COMMIT_MSG || true
fi
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="chore: preparando versão $VERSION"
fi

if [ "$SKIP_COMMIT" -eq 0 ]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git add -A
    git commit -m "$COMMIT_MSG"
  else
    echo "ℹ️ Nenhuma alteração para commit"
  fi
fi

git tag -a "$VERSION" -m "$COMMIT_MSG"
git push origin "$VERSION"

if [ -z "$BRANCH" ]; then
  BRANCH=$(git branch --show-current)
fi
git push origin "$BRANCH"

echo "✅ Tag $VERSION criada e publicada no GitHub."
echo "🚀 Acesse o GitHub e, se desejar, publique uma Release associada à tag $VERSION."
echo "🔧 Processo de Release - Finalizado com sucesso."

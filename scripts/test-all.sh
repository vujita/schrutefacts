#!/usr/bin/env bash
# Full pre-PR validation: lint/format, type-check, local postgres, migrations,
# production build, and Playwright e2e. Never touches the Neon prod DB in .env.
set -euo pipefail

export DATABASE_URL="postgresql://postgres:password@127.0.0.1:5432/schrutefacts"
export BETTER_AUTH_SECRET="${BETTER_AUTH_SECRET:-test-secret-not-for-runtime-0123456789}"
export BETTER_AUTH_URL="${BETTER_AUTH_URL:-http://localhost:3001}"
export CORS_ORIGIN="${CORS_ORIGIN:-http://localhost:3001}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Only tear down postgres if this script started it.
STARTED_PG=0
cleanup() {
  if [[ "$STARTED_PG" -eq 1 ]]; then
    echo "› stopping local postgres"
    docker compose stop postgres >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

step() {
  printf "\n\033[1;34m▶ %s\033[0m\n" "$1"
}

step "lint + format"
pnpm check

step "type-check (tsgo)"
pnpm check-types

if docker compose ps postgres 2>/dev/null | grep -q "running"; then
  echo "› postgres already running (will not tear down)"
else
  step "start local postgres"
  docker compose up -d postgres
  STARTED_PG=1
fi

step "wait for postgres"
for _ in $(seq 1 30); do
  if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker compose exec -T postgres pg_isready -U postgres >/dev/null

step "run migrations"
pnpm db:migrate

step "ensure playwright browsers"
pnpm --filter web exec playwright install chromium >/dev/null

step "build + e2e"
pnpm test:e2e

printf "\n\033[1;32m✓ test:all passed\033[0m\n"

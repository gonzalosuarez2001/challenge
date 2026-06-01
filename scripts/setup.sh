#!/usr/bin/env bash
set -e

echo "▶ Instalando dependencias..."
npm install

echo "▶ Generando Prisma Client..."
npx prisma generate

echo "✅ Proyecto inicializado. Corré 'npm run up' para iniciar."

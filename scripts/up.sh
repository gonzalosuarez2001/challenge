#!/usr/bin/env bash
set -e

echo "▶ Iniciando Supabase..."
npx supabase start

echo "▶ Ejecutando migraciones..."
npx prisma db push

echo "▶ Habilitando Realtime..."
npx prisma db execute --file supabase/scripts/enable_realtime.sql

echo "▶ Iniciando Next.js en http://localhost:3000..."
npm run dev

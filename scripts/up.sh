#!/usr/bin/env bash
set -e

echo "▶ Iniciando Supabase..."
npx supabase start

echo "▶ Seteando variables de entorno..."
PUBLISHABLE_KEY=$(npx supabase status -o env | grep "^PUBLISHABLE_KEY" | cut -d'"' -f2)
sed -i "s|NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=\"$PUBLISHABLE_KEY\"|" .env
echo "   PUBLISHABLE_KEY actualizada en .env"

echo "▶ Ejecutando migraciones..."
npx prisma db push

echo "▶ Habilitando Realtime..."
npx prisma db execute --file supabase/scripts/enable_realtime.sql

echo "▶ Configurando cron de reset..."
npx prisma db execute --file supabase/scripts/enable_cron.sql

echo "▶ Iniciando Next.js en http://localhost:3000..."
npm run dev

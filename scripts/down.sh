#!/usr/bin/env bash

echo "▶ Deteniendo Next.js (puerto 3000)..."
NEXT_PID=$(lsof -ti:3000 2>/dev/null || true)
if [ -n "$NEXT_PID" ]; then
  kill "$NEXT_PID" 2>/dev/null || true
  echo "  Next.js detenido (PID $NEXT_PID)"
else
  echo "  Next.js no estaba corriendo"
fi

echo "▶ Eliminando contenedores de Supabase..."
npx supabase stop --no-backup

echo "✅ Proyecto detenido."

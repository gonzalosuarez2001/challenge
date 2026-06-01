# Contador Global

Aplicación web de contador persistente y en tiempo real, desarrollada con Next.js 15+.

El valor del contador es global: se comparte entre todas las sesiones abiertas y se reinicia automáticamente a `0` tras **20 minutos de inactividad**.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Lenguaje | TypeScript |
| Base de datos | PostgreSQL via Supabase |
| ORM | Prisma 7 |
| Tiempo real | Supabase Realtime |
| Reset automático | Supabase Cron Job |
| Estilos | Tailwind CSS |
| Deploy | Vercel |

## Requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) (para la base de datos local y realtime de supabase)

## Inicialización local

### 1. Clonar el repositorio

```bash
git clone https://github.com/gonzalosuarez2001/challenge.git
cd challenge
```

### 2. Inicializar el proyecto (primera vez)

```bash
npm run setup
```

Instala dependencias y genera el Prisma Client.

### 3. Iniciar el proyecto

```bash
npm run up
```

Levanta Supabase con Docker, aplica el schema, habilita Realtime, registra el cron de reset automático (pg_cron cada minuto) y arranca Next.js en [http://localhost:3000](http://localhost:3000).

### 4. Eliminar el entorno local

```bash
npm run down
```

Detiene Next.js y elimina los contenedores de Supabase.
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
| Reset automático | pg_cron |
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

- Levanta Supabase con Docker
- Escribe automáticamente la `PUBLISHABLE_KEY` en `.env`
- Aplica el schema con Prisma
- Habilita Realtime para la tabla `counters`
- Registra el cron de reset automático (pg_cron cada minuto)
- Arranca Next.js en [http://localhost:3000](http://localhost:3000)

### 4. Detener el entorno local

```bash
npm run down
```

Detiene Next.js y elimina los contenedores de Supabase.

## Decisiones Técnicas

### Supabase Realtime para sincronización entre sesiones

Supabase Realtime escucha los cambios en PostgreSQL y los propaga a todos los clientes conectados vía WebSocket. Así, cualquier incremento o decremento se refleja instantáneamente en todas las sesiones abiertas.

### pg_cron para el reset automático a los 20 minutos

El requisito establece que el reinicio debe ejecutarse incluso cuando la página no se encuentre abierta, lo que descarta cualquier solución implementada del lado del cliente. Por este motivo, decidí por utilizar pg_cron, una extensión que permite programar y ejecutar sentencias SQL directamente dentro de PostgreSQL de forma periódica, sin tener que depender de la aplicación ni de la interacción de los usuarios. Además, el reset es una operación puramente de datos (`UPDATE counters SET value = 0 WHERE ...`) y no requiere lógica de aplicación.

### Optimistic UI para el valor del contador

Cada clic en incrementar/decrementar dispara una Server Action que envía la solicitud al servidor para procesarla. Sin optimistic UI, el usuario vería el contador congelado hasta que la respuesta vuelva, lo que da una sensación de lentitud.
Con optimistic UI el valor se actualiza inmediatamente en pantalla y, si el Server Action falla, se revierte al último valor confirmado por el servidor. 
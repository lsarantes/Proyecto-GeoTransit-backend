# ------------------------------------
# STAGE 1: Build (para compilar el código)
# ------------------------------------
FROM node:22.11.0 as builder

WORKDIR /src/app/nestjs

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el esquema de Prisma para generar el cliente
COPY prisma ./prisma

# 🚨 Generar el cliente de Prisma para que TypeScript lo encuentre
RUN npx prisma generate

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto NestJS (debe compilar todos los archivos, incluyendo seed.ts a dist/seed.js)
RUN npm run build

# ------------------------------------
# STAGE 2: Production (para ejecutar el código compilado)
# ------------------------------------
FROM node:22.11.0-slim

# 🚨 CORRECCIÓN OPENSSL: Instalar OpenSSL para permitir conexiones SSL/TLS de Prisma a Render DB
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Crear y establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar solo los archivos esenciales para la ejecución
COPY --from=builder /src/app/nestjs/package.json ./package.json
COPY --from=builder /src/app/nestjs/node_modules ./node_modules
COPY --from=builder /src/app/nestjs/dist ./dist
COPY --from=builder /src/app/nestjs/prisma ./prisma
# LÍNEA ELIMINADA: La carpeta .prisma no se encuentra en la raíz, se copia con node_modules.
# EXPLICITAMENTE ELIMINAMOS: COPY --from=builder /src/app/nestjs/.prisma ./.prisma

# Exponer el puerto
EXPOSE 3000 

# Comando Final de Arranque (Entrypoint)
# 🚨 CORRECCIÓN TS-NODE: Ahora usa el comando estándar de Prisma que ejecutará 'node dist/seed.js'
CMD [ "sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm run start" ]
# ------------------------------------
# STAGE 1: Build (para compilar el código)
# ------------------------------------
FROM node:22.11.0 as builder

WORKDIR /src/app/nestjs

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
# Usar 'npm ci' si tienes package-lock.json para instalaciones limpias y reproducibles
RUN npm install

# Copiar el resto del código fuente (incluyendo el directorio 'prisma' y migraciones)
COPY . .

# Compilar el proyecto NestJS
# ¡IMPORTANTE! El proceso 'npm run build' también genera el Prisma Client,
# pero lo regeneraremos en el Stage 2 para mayor seguridad.
RUN npm run build

# ------------------------------------
# STAGE 2: Production (para ejecutar el código compilado)
# ------------------------------------
FROM node:22.11.0-slim

# Crear y establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar solo los archivos esenciales para la ejecución
# 1. package.json para poder usar 'npm run start' y 'npx'
COPY --from=builder /src/app/nestjs/package.json ./package.json

# 2. node_modules (dependencias de producción)
COPY --from=builder /src/app/nestjs/node_modules ./node_modules

# 3. El código compilado
COPY --from=builder /src/app/nestjs/dist ./dist

# 4. Archivos de Prisma necesarios para las migraciones, generación y el seeding
# Copia el esquema de prisma y el directorio de migraciones
COPY --from=builder /src/app/nestjs/prisma ./prisma

# 5. El Cliente de Prisma generado (binarios y archivos de conexión)
# Esto es CRÍTICO para que NestJS pueda interactuar con la DB
COPY --from=builder /src/app/nestjs/.prisma ./.prisma

# Exponer el puerto
EXPOSE 3000 

# Comando Final de Arranque (Entrypoint)
# Se usa 'sh -c' para encadenar cuatro comandos:
# 1. npx prisma generate: Asegura que el cliente binario sea correcto para este entorno.
# 2. npx prisma migrate deploy: Aplica las migraciones pendientes.
# 3. npx prisma db seed: Población inicial de datos.
# 4. npm run start: Inicia la aplicación NestJS.
CMD [ "sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm run start" ]
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
# Esto también garantiza que los archivos binarios necesarios estén en node_modules
RUN npx prisma generate

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto NestJS (ahora con los typings de Prisma disponibles)
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

# 2. node_modules (dependencias de producción, incluyendo el cliente de Prisma binario)
# Esta es la línea que debe copiar lo necesario para el cliente
COPY --from=builder /src/app/nestjs/node_modules ./node_modules

# 3. El código compilado
COPY --from=builder /src/app/nestjs/dist ./dist

# 4. Archivos de Prisma necesarios (schema y migrations)
COPY --from=builder /src/app/nestjs/prisma ./prisma

# 🚨 LÍNEA FALLIDA ELIMINADA: Ya no se copia la carpeta .prisma de la raíz

# Exponer el puerto
EXPOSE 3000 

# Comando Final de Arranque (Entrypoint) - Con generación, migración y seed
# La regeneración sigue siendo útil para verificar que el cliente usa el binario correcto
CMD [ "sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm run start" ]
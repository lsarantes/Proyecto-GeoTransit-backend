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

# 🚨 CORRECCIÓN CLAVE: Generar el cliente de Prisma para que TypeScript lo encuentre
# Esto crea el @prisma/client con los tipos de tus modelos/enums.
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
COPY --from=builder /src/app/nestjs/package.json ./package.json
COPY --from=builder /src/app/nestjs/node_modules ./node_modules
COPY --from=builder /src/app/nestjs/dist ./dist
COPY --from=builder /src/app/nestjs/prisma ./prisma
COPY --from=builder /src/app/nestjs/.prisma ./.prisma

# Exponer el puerto
EXPOSE 3000 

# Comando Final de Arranque (Entrypoint) - Con generación, migración y seed
CMD [ "sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm run start" ]
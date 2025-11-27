# ------------------------------------
# STAGE 1: Build (para compilar el código)
# ------------------------------------
FROM node:22.11.0 as builder

WORKDIR /src/app/nestjs

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
# Considera usar 'npm ci' si tienes 'package-lock.json' para instalaciones limpias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto NestJS (se asume que usa 'tsc' o 'nest build')
RUN npm run build

# ------------------------------------
# STAGE 2: Production (para ejecutar el código compilado)
# ------------------------------------
FROM node:22.11.0-slim

# Crear y establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar solo el código compilado y los archivos de producción
COPY --from=builder /src/app/nestjs/package.json ./package.json
COPY --from=builder /src/app/nestjs/node_modules ./node_modules
COPY --from=builder /src/app/nestjs/dist ./dist

# Exponer el puerto que usa NestJS (normalmente 3000 o 4000)
# ¡Asegúrate de que este puerto coincida con el puerto interno de tu aplicación!
EXPOSE 3000 

# Comando para ejecutar la aplicación compilada
# Reemplaza 'main.js' por el nombre de tu archivo de arranque principal si es diferente.
CMD [ "node", "dist/main" ]
# Imagen base de Node.js
FROM node:22.11.0

# Crear directorio de trabajo
WORKDIR /src/app/nestjs

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (incluye prisma y @prisma/client si están en package.json)
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Generar el cliente de Prisma (por si cambian los modelos)
RUN npx prisma generate

# Exponer puerto
EXPOSE 3000

# Comando para arrancar la app en modo desarrollo
CMD ["npm", "run", "start:dev"]

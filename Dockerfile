# Imagen base de Node.js
FROM node:22.11.0

# Crear directorio de trabajo
WORKDIR /src/app/nestjs

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar archvos de configuración de TypeScript y NestJS
COPY tsconfig.json ./
COPY nest-cli.json ./

# Exponer puerto
EXPOSE 3000

# Comando para desarrollo
CMD ["sh", "-c", "sleep infinity"]

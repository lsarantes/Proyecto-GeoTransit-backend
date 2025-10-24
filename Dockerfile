# Imagen base de Node.js
FROM node:22.11.0

# Crear directorio de trabajo
WORKDIR /src/app/nestjs

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install 

# Copiar el resto del proyecto
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para arrancar la app en desarrollo
CMD ["npm", "run", "start:dev"]

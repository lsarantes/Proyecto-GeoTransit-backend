
# 💻 Proyecto GeoTransit — Backend

## 📝 Descripción general
**GeoTransit — Backend**  
API de transporte público y geolocalización desarrollada con **NestJS** y **PostgreSQL**, preparada para ejecutarse con **Docker Compose**.  
Incluye instrucciones para desarrollo local, trabajo con contenedores remotos y flujo colaborativo con **Git Flow**.

---

## ⚙️ Requisitos previos
- Git (y opcionalmente `git-flow`).
- Docker Desktop y Docker Compose (abiertos/activos).
- (Opcional) Node.js y npm si querés ejecutar el proyecto **sin Docker**.

---

## 🚀 Inicio del proyecto (primera vez)
1. Clonar el repositorio:
```bash
git clone git@github.com:lsarantes/Proyecto-GeoTransit-backend.git
cd Proyecto-GeoTransit-backend
```

2. Inicializar Git Flow (opcional):
```bash
git flow init
```

3. Crear tu rama de trabajo (opcional / ejemplo con Git Flow):
```bash
git flow feature start nombre_de_tu_feature
# al terminar:
git flow feature finish nombre_de_tu_feature
```

---

# 🧭 Git Flow — tipos de ramas (con comandos para iniciar y finalizar)

| Tipo | Prefijo | Propósito | Iniciar | Finalizar |
|---|---:|---|---:|---:|
| `main` | (ninguno) | Código estable / producción | — | — |
| `develop` | (ninguno) | Integración / desarrollo | — | — |
| `feature/*` | `feature/` | Nueva funcionalidad | `git flow feature start <nombre>` | `git flow feature finish <nombre>` |
| `release/*` | `release/` | Preparación de versión | `git flow release start <versión>` | `git flow release finish <versión>` |
| `hotfix/*` | `hotfix/` | Corrección urgente sobre `main` | `git flow hotfix start <nombre>` | `git flow hotfix finish <nombre>` |
| `bugfix/*` | `bugfix/` | Arreglos menores (sobre `develop` o `feature`) | `git checkout -b bugfix/<nombre> develop` | `git checkout develop && git merge bugfix/<nombre> && git branch -d bugfix/<nombre>` |

> **Nota breve:** `main` contiene la versión en producción; `develop` es para integración diaria. Los prefijos (`feature/`, `hotfix/`, etc.) ayudan a identificar la finalidad de la rama.

---

## 🐳 Docker — levantar la stack

- Levantar en primer plano (ver logs):
```bash
docker compose up
```

- Levantar en background (detached):
```bash
docker compose up -d
```

- Forzar reconstrucción antes de levantar:
```bash
docker compose up --build
# o
docker compose up --build -d
```

**Cuándo usar cada uno**
- `up`: ver logs en tiempo real (útil para debugging).
- `up -d`: dejar servicios corriendo en segundo plano (útil en desarrollo/CI).
- `up --build`: cuando cambias el `Dockerfile` o dependencias y querés una imagen nueva.

---

## 🔄 Ejecutar comandos dentro del contenedor

### Cuando el servicio **está apagado**
- Ejecutar una tarea puntual sin levantar la stack completa:
```bash
docker compose run --rm geo-transit-backend sh -c "npm install"
```
`docker compose run` crea un contenedor temporal para ejecutar el comando; `--rm` lo borra al terminar.

### Cuando el servicio **está levantado**
- Ejecutar comandos dentro del contenedor en ejecución (por nombre de servicio):
```bash
docker compose exec geo-transit-backend sh -c "npm install"
```
- O usando el nombre del contenedor:
```bash
docker exec -it nestjs-api-geotransit sh -c "npx prisma generate"
```

**Regla práctica**
- Servicio levantado → `docker compose exec` o `docker exec -it`.
- Servicio apagado y querés ejecutar algo puntual → `docker compose run --rm`.

---

## 🧹 Docker — detener y limpiar (contenedores, volúmenes, imágenes)

> ⚠️ **Advertencia:** Eliminar volúmenes borra datos persistentes (p.ej. la DB). Hacé backup si hace falta.

- Detener (no elimina):
```bash
docker compose stop
```

- Bajar y eliminar contenedores y redes (no borra volúmenes ni imágenes):
```bash
docker compose down
```

- Bajar y eliminar contenedores, redes y volúmenes:
```bash
docker compose down --volumes
```

- Bajar y eliminar contenedores, redes, volúmenes y las imágenes locales construidas:
```bash
docker compose down --volumes --rmi local
```

- Bajar y eliminar todo (incluye imágenes usadas por el compose):
```bash
docker compose down --volumes --rmi all
```

- Parar y eliminar un contenedor por nombre:
```bash
docker stop nestjs-api-geotransit
docker rm nestjs-api-geotransit
```

- Eliminar una imagen:
```bash
docker rmi <nombre_o_id_de_imagen>
```

- Eliminar volúmenes:
```bash
docker volume ls
docker volume rm postgres_data
```

- Limpieza general:
```bash
docker system prune --volumes
# más agresivo:
docker system prune -a --volumes
```

---

## 🔤 Abreviaciones / flags comunes (breve)

- `-d` → detached (ej. `docker compose up -d`): ejecutar en segundo plano.  
- `-it` → `-i` (interactive) + `-t` (tty): abrir shell interactivo (`docker exec -it ...`).  
- `sh` → shell básico (ej.: `sh -c "cmd1 && cmd2"`).  
- `-c` → indica al shell que ejecute la cadena de comandos que sigue.  
- `--rm` → eliminar contenedor al terminar (ej. `docker compose run --rm`).  
- `--build` → reconstruir imagen antes de levantar (`docker compose up --build`).  
- `--volumes` → eliminar volúmenes al hacer `down`.  
- `--rmi local|all` → eliminar imágenes locales o todas.  
- En Git: `-m` (mensaje en `git commit -m`), `-u` (establecer upstream en `git push -u origin <rama>`).

---

## 🧱 Variables de entorno — `.env` (crear en la raíz)
Crea un archivo `.env` con estas variables (pueden quedar sin valor para que el equipo las complete):

```env
# Puerto backend
BACKEND_PORT=3000

# Configuración de la base de datos
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_HOST_PORT=5432

# Prisma
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres-geotransit:5432/${POSTGRES_DB}?schema=public
```

> Pide al administrador las credenciales reales o completalas según entorno.

---

## 🧩 Prisma — errores comunes y migraciones (breve)

- **Prisma client out-of-sync**: ocurre si cambias `schema.prisma` y no regenerás el cliente.  
  - Regenerar local:
    ```bash
    npx prisma generate
    ```
  - Regenerar dentro del contenedor (servicio levantado):
    ```bash
    docker compose exec geo-transit-backend sh -c "npx prisma generate"
    ```
  - Si el servicio está apagado y hacés puntual:
    ```bash
    docker compose run --rm geo-transit-backend sh -c "npx prisma generate"
    ```

- **Migraciones**
  - Crear migración (dev):
    ```bash
    npx prisma migrate dev --name <nombre_migracion>
    ```
  - Aplicar migraciones (dev):
    ```bash
    npx prisma migrate dev
    ```
  - Aplicar migraciones (producción):
    ```bash
    npx prisma migrate deploy
    ```

---

## 🧰 Comandos básicos de Git (rápido)

- Clonar:
```bash
git clone <url>
```
- Estado:
```bash
git status
```
- Preparar cambios:
```bash
git add .
```
- Commit:
```bash
git commit -m "Mensaje descriptivo"
```
- Traer y fusionar cambios remotos:
```bash
git pull
```
- Enviar cambios:
```bash
git push
```
- Crear rama:
```bash
git checkout -b nombre_rama
```
- Fusionar:
```bash
git checkout develop
git merge feature/mi-feature
```
- Establecer upstream en primer push:
```bash
git push -u origin nombre_rama
```

---

## 🧪 Ejemplos prácticos (errores frecuentes y solución rápida)

- **`node_modules` no encontrado**
  - Local:
    ```bash
    npm install
    ```
  - En contenedor (servicio apagado):
    ```bash
    docker compose run --rm geo-transit-backend sh -c "npm install"
    ```
  - En contenedor (servicio levantado):
    ```bash
    docker compose exec geo-transit-backend sh -c "npm install"
    # o
    docker exec -it nestjs-api-geotransit sh -c "npm install"
    ```

- **Prisma client / enums / tablas faltan**
  - Regenerar cliente:
    ```bash
    npx prisma generate
    # o dentro del contenedor:
    docker compose exec geo-transit-backend sh -c "npx prisma generate"
    ```

---

## 🔧 Dockerfile (tu configuración — con breve explicación)
```dockerfile
# Imagen base de Node.js
FROM node:22.11.0

# Crear directorio de trabajo
WORKDIR /src/app/nestjs

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar archivos de configuración
COPY tsconfig.json ./
COPY nest-cli.json ./

# Exponer puerto
EXPOSE 3000

# Comando para desarrollo
CMD ["sh", "-c", "npx prisma generate && npm run start:dev"]
```

> **Sugerencia:** es preferible generar `prisma generate` durante el `build` (`RUN npx prisma generate`) para evitar hacerlo en `CMD`, pero el `CMD` actual funciona para desarrollo. Si querés, te puedo ajustar el Dockerfile.

---

## 🗂 docker-compose (fragmento importante)
```yaml
services:
  geo-transit-backend:
    container_name: nestjs-api-geotransit
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "${BACKEND_PORT}:3000"
    volumes:
      - ".:/src/app/nestjs"
    depends_on:
      - postgres
    env_file:
      - .env
  postgres:
    container_name: postgres-geotransit
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_HOST_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 🧾 .dockerignore (recomendado)
```text
node_modules
/dist
/build
logs
*.log
npm-debug.log*
.vscode/*
.env
.env.*.local
/temp
.tmp
pids
*.pid
coverage
```

---

## 🧩 VS Code — extensión recomendada (Remote)
Instalar: **Remote Development** (pack) o la extensión **Dev Containers (Remote - Containers)** (`ms-vscode-remote.remote-containers`).  
- Permite: **adjuntar VS Code al contenedor**, editar y ejecutar terminal dentro del contenedor sin instalar dependencias localmente.

---

## ✅ Resumen / Cheatsheet rápida
- Levantar en foreground: `docker compose up`  
- Levantar en background: `docker compose up -d`  
- Ejecutar tarea puntual en contenedor apagado: `docker compose run --rm geo-transit-backend sh -c "..."`  
- Ejecutar dentro de contenedor en ejecución: `docker compose exec geo-transit-backend sh -c "..."`  
- Limpiar todo (volúmenes e imágenes): `docker compose down --volumes --rmi all`  
- Regenerar Prisma: `npx prisma generate` (o dentro del contenedor con `docker compose exec ...`)

# 💻 Proyecto GeoTransit — Backend

## 📝 Descripción general
**GeoTransit — Backend**  
API de transporte público y geolocalización desarrollada con **NestJS** y **PostgreSQL**, preparada para ejecutarse con **Docker Compose**.  
Incluye instrucciones para desarrollo local, trabajo con contenedores remotos (VS Code DevContainers) y flujo colaborativo con **Git Flow**.

---

## ⚙️ Requisitos previos (primera vez)
Antes de empezar asegúrate de tener instaladas las siguientes herramientas:

- **Git** (cliente).  
- **Docker Desktop** (incluye Docker Engine y Docker Compose).  
- **Visual Studio Code** + extensión **Dev Containers (Remote Development)** - muy recomendable si desea trabajar desde dentro del contenedor.  
- (Opcional) **Node.js** y **npm** si querés ejecutar el proyecto sin Docker.

> Nota: **No es necesario instalar Git dentro del contenedor**. Git se debe usar desde tu máquina local para evitar problemas de sincronización entre sistemas de archivos (Windows vs Linux).

---

## 🚀 Primer arranque (clonar y preparar el entorno)
1. Clonar el repositorio:
```bash
git clone git@github.com:lsarantes/Proyecto-GeoTransit-backend.git
cd Proyecto-GeoTransit-backend
```

2. Crear archivo `.env` en la raíz (puede pedir datos al equipo):
```env
BACKEND_PORT=puerto_del_proyecto
POSTGRES_USER= usuario_de_BD
POSTGRES_PASSWORD=_Su_contraseña
POSTGRES_DB=nombre_bd
POSTGRES_HOST_PORT=puerto_de_postgres

DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:${POSTGRES_HOST_PORT}/${POSTGRES_DB}
```

3. Inicializar Git Flow:
```bash
git flow init
```

4. Levantar la base (Postgres) y el backend (modo desarrollo):
```bash
docker compose up --build -d
```
> Alternativa: **Si se instaló la extensión de VS Code Remote Development**, podés abrir el contenedor desde VS Code y trabajar desde allí.

5. Generar Prisma Client, aplicar migraciones y cargar seed (puede ejecutarse en el contenedor backend):
```bash
# dentro de la máquina local usando docker compose exec
docker compose exec geo-transit-backend sh -c "npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed"
```
> Alternativa con VS Code Dev Container: ejecutá paso a paso en la terminal del contenedor `npx prisma generate`, `npx prisma migrate deploy`, `npx prisma db seed`.

---

### Volúmenes y `node_modules`
- Para evitar que el montaje de la carpeta local sobrescriba `node_modules` instalados en la imagen, usamos un volumen separado para `node_modules`:
```yaml
volumes:
  - ".:/src/app/nestjs"
  - /src/app/nestjs/node_modules
```
- Esto mantiene las dependencias dentro del contenedor sin mezclarlas con la carpeta local.

---

### Prisma — migraciones y seed (recordatorio)
- Aplicar migraciones existentes:
```bash
npx prisma migrate deploy
```
- Cargar seed:
```bash
npx prisma db seed
```
- Generar cliente:
```bash
npx prisma generate
```

Comandos también se pueden ejecutar dentro del contenedor con `docker compose exec`.

---

## 🧭 Git Flow — tipos de ramas (resumen)
| Tipo | Prefijo | Propósito | Iniciar | Finalizar |
|---|---:|---|---:|---|
| `main` | (ninguno) | Código estable / producción | — | — |
| `develop` | (ninguno) | Integración / desarrollo | — | — |
| `feature/*` | `feature/` | Nueva funcionalidad | `git flow feature start <nombre>` | `git flow feature finish <nombre>` |
| `release/*` | `release/` | Preparación de versión | `git flow release start <versión>` | `git flow release finish <versión>` |
| `hotfix/*` | `hotfix/` | Corrección urgente sobre `main` | `git flow hotfix start <nombre>` | `git flow hotfix finish <nombre>` |
| `bugfix/*` | `bugfix/` | Arreglos menores | `git checkout -b bugfix/<nombre> develop` | `git checkout develop && git merge bugfix/<nombre> && git branch -d bugfix/<nombre>` |

---

## ℹ️ Comandos que se pueden ejecutar **más de una vez** (rápido)

- Instalar dependencias:
```bash
npm install
# dentro del contenedor (si está levantado)
docker compose exec geo-transit-backend sh -c "npm install"
# si el servicio está apagado (contenedor temporal)
docker compose run --rm geo-transit-backend sh -c "npm install"
```

- Generar recursos con Nest (scaffold):
```bash
npx nest generate resource <nombre> [--no-spec]
```

- Regenerar Prisma Client (cuando cambias schema):
```bash
npx prisma generate
docker compose exec geo-transit-backend sh -c "npx prisma generate"
```

- Aplicar migraciones existentes (deploy / al traer migraciones nuevas):
```bash
npx prisma migrate deploy
docker compose exec geo-transit-backend sh -c "npx prisma migrate deploy"
```

- Crear/aplicar migración en dev:
```bash
npx prisma migrate dev --name <nombre_migracion>
```

- Cargar seed:
```bash
npx prisma db seed
docker compose exec geo-transit-backend sh -c "npx prisma db seed"
```

- Iniciar en modo dev (hot-reload):
```bash
npm run start:dev
docker compose exec geo-transit-backend sh -c "npm run start:dev"
```

---

## 🐳 Docker — comandos y notas (ayuda)
- Levantar en foreground (ver logs):
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

**Cuándo usar**:
- `up` → ver logs y fallos en tiempo real.
- `up -d` → dejar servicios corriendo en segundo plano.
- `up --build` → cuando cambias `Dockerfile` o dependencias.

---

## 🔄 Ejecutar comandos dentro del contenedor (ayuda)
### Servicio apagado (tarea puntual)
```bash
docker compose run --rm geo-transit-backend sh -c "npm install"
```

### Servicio en ejecución
```bash
docker compose exec geo-transit-backend sh -c "npx prisma generate"
# o
docker exec -it nestjs-api-geotransit sh
# dentro del shell:
npx prisma generate
```

**Regla práctica**:
- Servicio levantado → `docker compose exec` / `docker exec -it`.
- Servicio apagado y querés ejecutar algo puntual → `docker compose run --rm`.

---

## 🧹 Detener y limpiar (contenedores, volúmenes, imágenes)
> ⚠️ Eliminar volúmenes borra datos persistentes (DB). Hacé backup si hace falta.

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

- Bajar y eliminar contenedores, redes, volúmenes e imágenes locales construidas:
```bash
docker compose down --volumes --rmi local
```

- Limpieza general:
```bash
docker system prune --volumes
# o más agresivo:
docker system prune -a --volumes
```

---

## ⚠️ Problemas comunes y soluciones rápidas

### `node_modules` no encontrado
- Local:
```bash
npm install
```
- En contenedor (servicio en ejecución):
```bash
docker compose exec geo-transit-backend sh -c "npm install"
```

### Prisma client out-of-sync
```bash
npx prisma generate
# o dentro del contenedor:
docker compose exec geo-transit-backend sh -c "npx prisma generate"
```

### Problemas con mayúsculas/minúsculas (casing)
- Linux es case-sensitive. Si ves errores como:
```
Already included file name ... differs from file name ... only in casing
```
Significa que hay imports que usan `Users` y archivos que están en `users`. Solución:
1. Homogeneizar nombres de carpetas (recomendado: usar **minúsculas**).
2. Buscar referencias:
```bash
grep -r "Users" src/
```
3. Reemplazar e incluso forzar a Git a reconocer el cambio:
```bash
git mv src/Users src/users   # si git aún conserva el nombre "Users"
git commit -m "Fix folder casing users"
```
4. Borrar caches:
```bash
rm -rf dist
rm -f tsconfig.tsbuildinfo
```

### Line endings (CRLF vs LF)
Si trabajás entre Windows y Linux, configurá:
- `.gitattributes` en el repo:
```
* text=auto
*.ts text eol=lf
*.json text eol=lf
```
- En tu máquina:
```bash
git config --global core.autocrlf input
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
- Traer y fusionar:
```bash
git pull
```
- Enviar:
```bash
git push
```
- Crear rama:
```bash
git checkout -b nombre_rama
```
- Establecer upstream:
```bash
git push -u origin nombre_rama
```

---

## ✅ Resumen / Cheatsheet rápida
- Levantar: `docker compose up`  
- Levantar background: `docker compose up -d`  
- Reconstruir: `docker compose up --build`  
- Ejecutar tarea puntual (contenedor apagado): `docker compose run --rm geo-transit-backend sh -c "..."`  
- Ejecutar dentro del contenedor (corriendo): `docker compose exec geo-transit-backend sh -c "..."`  
- Limpiar todo: `docker compose down --volumes --rmi all`  
- Regenerar Prisma: `npx prisma generate` (o `docker compose exec ...`)

# 💻 **Proyecto GeoTransit - Backend**

## ⚙️ **Comandos Iniciales**
> **Nota importante**: Estos comando solo se ejecutaran una vez al iniciar el proyecto.

### ✈️ 1.Git bash
```bash
git clone git@github.com:lsarantes/Proyecto-GeoTransit-backend.git
git flow init
```
### 🤖 2.Instalar nodejs y nestjs
```
npm i -g @nestjs/cli
```
## 🦭 **Comandos para subir cambios al repo remoto** 

Para enviar los cambios locales al repositorio remoto **`Solo la primera vez`**, usa:
``` bash
git push -u origin main 
``` 


Este comando sube la rama **`main`** al repositorio remoto (**`origin`**) y establece un vínculo entre ambas ramas.  
Después de ejecutarlo una vez, puedes usar simplemente:
```bash
git push
```
para subir futuros cambios de la misma rama sin tener que especificar el remoto ni la rama.

> 💡 **IMPORTANTE:** si trabajas en otra rama (por ejemplo, `develop`), reemplaza `main` por el nombre de esa rama.

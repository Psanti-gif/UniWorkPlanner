# Guía completa de instalación — UniWork Planner

> **Para compañeros del equipo.** Esta guía asume que **nunca has hecho esto antes**. Sigue los pasos en orden, no te saltes nada. Si algo falla, busca tu error en la sección **"Errores comunes"** al final.

---

## 1. Software que necesitas instalar (una sola vez)

Descarga e instala en este orden:

### 1.1. Git
- Descarga: <https://git-scm.com/download/win>
- Durante la instalación deja **todas las opciones por defecto**.
- Verifica abriendo **PowerShell** (Win+R → `powershell` → Enter) y ejecutando:
  ```powershell
  git --version
  ```
  Debe mostrar algo como `git version 2.45.x`.

### 1.2. Java 21 (JDK)
- Descarga **JDK 21 (LTS)** desde Eclipse Temurin: <https://adoptium.net/temurin/releases/?version=21>
- Selecciona: **Windows x64 · JDK · .msi installer**
- Durante la instalación marca la opción **"Set JAVA_HOME variable"** y **"Add to PATH"**.
- Verifica en PowerShell:
  ```powershell
  java -version
  ```
  Debe decir `openjdk version "21.x.x"`.

### 1.3. Node.js (versión 20 o superior)
- Descarga: <https://nodejs.org/> (botón verde **LTS**)
- Instalador por defecto, siguiente, siguiente, finalizar.
- Verifica:
  ```powershell
  node --version
  npm --version
  ```

### 1.4. XAMPP (para correr MySQL)
- Descarga: <https://www.apachefriends.org/download.html>
- Selecciona **XAMPP for Windows**, versión con PHP 8.x.
- Instala en `C:\xampp` (ruta por defecto).
- Cuando termine, **abre el XAMPP Control Panel**.

### 1.5. MySQL Workbench (para ver la base de datos)
- Descarga: <https://dev.mysql.com/downloads/workbench/>
- En la página: **"No thanks, just start my download"** abajo del formulario.
- Instalador por defecto.

### 1.6. Visual Studio Code (editor de código)
- Descarga: <https://code.visualstudio.com/>
- Instalador por defecto.

---

## 2. Configurar la base de datos en XAMPP

### 2.1. Iniciar MySQL
1. Abre **XAMPP Control Panel** (búscalo en el menú inicio).
2. Al lado de **MySQL**, haz clic en **Start**.
3. El recuadro de MySQL debe ponerse verde con el texto `Running`.

> **IMPORTANTE:** Cada vez que vayas a trabajar en el proyecto, **debes abrir XAMPP y hacer Start en MySQL primero**. Si MySQL no está corriendo, el backend no arranca.

### 2.2. Conectar MySQL Workbench

1. Abre **MySQL Workbench**.
2. En la pantalla principal verás un recuadro `Local instance MySQL` o `Local instance 3306`. Haz **doble clic**.
3. Si pide contraseña, **dejala en blanco** y presiona **OK** (XAMPP por defecto usa usuario `root` sin contraseña).
4. Si todo va bien, verás la pestaña de la base de datos abierta.

### 2.3. Crear la base de datos del proyecto

1. En MySQL Workbench, arriba a la izquierda hay un icono que parece un **rayo (⚡)** o presiona `Ctrl + T` para abrir una nueva pestaña SQL.
2. **Copia y pega** todo el contenido del archivo `backend/sql/init.sql` del proyecto en esa pestaña.
3. Presiona el icono de **rayo (⚡ Execute)** o `Ctrl + Shift + Enter`.
4. Debe aparecer abajo `1 row(s) affected` varias veces sin errores rojos.
5. En el panel izquierdo, presiona el icono de **actualizar** (flecha circular sobre "SCHEMAS"). Debe aparecer `gestor_pendientes`.

> **Tip:** Para ver los datos: clic derecho sobre `gestor_pendientes` → **Set as Default Schema**. Luego expande la tabla `tareas` → clic derecho → **Select Rows - Limit 1000**.

---

## 3. Clonar el repositorio

1. Abre **PowerShell** en la carpeta donde quieres tener el proyecto (por ejemplo el Escritorio):
   ```powershell
   cd $env:USERPROFILE\Desktop
   ```
2. Clona el repo:
   ```powershell
   git clone https://github.com/Psanti-gif/UniWorkPlanner.git
   cd UniWorkPlanner
   ```
3. Cambia a la rama con todos los cambios más recientes (si no estás ya en `main`):
   ```powershell
   git checkout main
   git pull
   ```

---

## 4. Configurar la API key de la IA (opcional pero recomendado)

El asistente IA usa Claude (Anthropic). **Sin API key, el asistente no funciona pero el resto de la app sí.**

### Si quieres usar el asistente IA:

1. Pide a Santiago la API key del proyecto **o** crea una tuya:
   - Ve a <https://console.anthropic.com/>
   - Registra una cuenta (te dan créditos gratis para empezar)
   - **API Keys** → **Create Key** → copia la key (empieza con `sk-ant-api03-...`)

2. Abre el archivo `backend/src/main/resources/application-dev.yaml` en VS Code.

3. Busca la línea:
   ```yaml
   anthropic:
     api-key: TU_API_KEY_AQUI
   ```

4. Reemplaza `TU_API_KEY_AQUI` con tu key real:
   ```yaml
   anthropic:
     api-key: sk-ant-api03-xxxxxxxxxxxxx
   ```

5. **Guarda el archivo (Ctrl+S).**

> **⚠️ MUY IMPORTANTE:** **NUNCA hagas `git commit` con tu API key dentro.** Antes de cualquier `git push`, ejecuta:
> ```powershell
> git status
> ```
> Si ves `application-dev.yaml` en la lista, **NO lo agregues al commit**. Tu key es personal y secreta.

---

## 5. Ejecutar el backend (Spring Boot)

1. **Verifica que XAMPP MySQL esté corriendo** (paso 2.1).

2. Abre **PowerShell** en la carpeta del proyecto:
   ```powershell
   cd $env:USERPROFILE\Desktop\UniWorkPlanner\backend
   ```

3. Ejecuta:
   ```powershell
   .\gradlew.bat bootRun
   ```

4. La primera vez tarda 2-5 minutos descargando dependencias. Espera con paciencia.

5. Cuando veas algo como:
   ```
   Started GestorPendientesApplication in X.XXX seconds
   ```
   **el backend está corriendo en** `http://localhost:8090`.

6. Verifica abriendo en el navegador: <http://localhost:8090/uniworkplanner/swagger-ui.html>
   Debe aparecer la documentación de la API.

> **Para detener el backend:** En la PowerShell donde corre, presiona `Ctrl + C` y confirma con `S`.
>
> **Deja esa PowerShell abierta mientras trabajas.** No la cierres.

---

## 6. Ejecutar el frontend (React)

1. Abre **otra PowerShell** (no cierres la del backend).

2. Ve a la carpeta del frontend:
   ```powershell
   cd $env:USERPROFILE\Desktop\UniWorkPlanner\frontend-react
   ```

3. Instala las dependencias (solo la primera vez):
   ```powershell
   npm install
   ```
   Tarda 1-3 minutos.

4. Arranca el servidor de desarrollo:
   ```powershell
   npm run dev
   ```

5. Verás algo como:
   ```
   VITE v8.x  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

6. **Abre en el navegador:** <http://localhost:5173>

¡Ya estás dentro de la app!

---

## 7. Uso diario — qué hacer cada vez que vas a trabajar

1. Abre **XAMPP Control Panel** → **Start** en MySQL.
2. Abre **PowerShell #1** → `cd ...\UniWorkPlanner\backend` → `.\gradlew.bat bootRun`.
3. Abre **PowerShell #2** → `cd ...\UniWorkPlanner\frontend-react` → `npm run dev`.
4. Abre el navegador en <http://localhost:5173>.

**Al terminar:** `Ctrl+C` en ambas PowerShells. Stop en MySQL desde XAMPP.

---

## 8. Funcionalidades de la app

| Acceso | Qué hace |
|---|---|
| `Ctrl + K` (Cmd+K en Mac) | **Buscador rápido** — encuentra cualquier tarea o página al instante |
| Botón 🤖 abajo derecha | **Asistente IA** — puede crear, modificar, eliminar tareas por ti |
| Sidebar → flecha abajo izquierda | Colapsar/expandir menú lateral |
| Arrastrar tareas en Kanban | Cambiar de estado |
| Botón **+ Adjuntar** en detalle de tarea | Subir archivos (PDF, imágenes, Excel, Word, ZIP — máx 20MB) |

### Ejemplos de qué puedes pedirle al asistente IA:
- *"¿Qué debería priorizar hoy?"*
- *"Crea una tarea para estudiar bases de datos mañana"*
- *"Cambia la tarea #5 a completada"*
- *"Sube la prioridad de [nombre tarea] a alta"*
- *"Elimina la tarea #3"*

Cuando proponga una acción, te mostrará botones **Aceptar / Cancelar** — también puedes escribir `aceptar` o `cancelar` directamente.

---

## 9. Errores comunes

### ❌ "Port 8090 already in use" / "Address already in use"
Otro proceso está usando el puerto. Ciérralo:
```powershell
Get-NetTCPConnection -LocalPort 8090 | Select-Object OwningProcess
Stop-Process -Id <NUMERO_QUE_TE_DEVUELVE>
```

### ❌ "Communications link failure" al arrancar backend
**Causa:** MySQL no está corriendo.
**Solución:** Abre XAMPP → Start en MySQL.

### ❌ Backend arranca pero "No 'Access-Control-Allow-Origin'" en frontend
**Causa:** El backend no terminó de arrancar cuando intentaste cargar el frontend.
**Solución:** Espera a que veas `Started GestorPendientesApplication` en la PowerShell del backend, luego recarga la página del navegador.

### ❌ "Could not find a version that satisfies the requirement" en npm install
**Causa:** Tu Node.js es muy viejo.
**Solución:** Instala Node.js LTS desde <https://nodejs.org/>.

### ❌ Caracteres con tilde aparecen como `??`
**Causa:** Conexión MySQL sin UTF-8. Ya está corregido en el repo.
**Verificar:** El archivo `backend/src/main/resources/application-dev.yaml` debe tener:
```yaml
url: jdbc:mysql://localhost:3306/gestor_pendientes?useUnicode=true&characterEncoding=UTF-8&useSSL=false
```

### ❌ El asistente IA dice "Error al conectar con la IA"
**Causa:** API key no configurada o inválida.
**Solución:** Revisa el paso **4** de esta guía.

### ❌ MySQL Workbench dice "Can't connect to MySQL server"
**Causa:** XAMPP MySQL no está corriendo.
**Solución:** Start en XAMPP. Si sigue fallando, en XAMPP haz **Config → my.ini** y verifica `port=3306`.

### ❌ "Error 500" al crear tarea o cambiar estado
**Causa probable:** La tabla `tareas` no tiene el ENUM con `CANCELADA`, o no existe la tabla `archivos`.
**Solución:** Ejecuta nuevamente `backend/sql/init.sql` completo en MySQL Workbench (paso 2.3). El script usa `CREATE TABLE IF NOT EXISTS`, no borra datos.

### ❌ Al hacer `git pull` aparecen conflictos
Llama a Santiago. **No fuerces nada** (`git reset --hard`, `git push --force` pueden destruir trabajo del equipo).

---

## 10. Flujo de trabajo con Git (para subir tus cambios)

> Antes de tocar código, **siempre haz pull primero**.

```powershell
# Antes de empezar:
git checkout main
git pull

# Crea tu propia rama:
git checkout -b mi-nombre/lo-que-vas-a-hacer

# Después de cambiar archivos:
git add .                              # agrega tus cambios
git status                             # ⚠️ VERIFICA que NO esté application-dev.yaml si tiene tu API key
git commit -m "describe lo que hiciste"
git push -u origin mi-nombre/lo-que-vas-a-hacer
```

Luego en GitHub crea un **Pull Request** hacia `main`.

---

## 11. Estructura del proyecto

```
UniWorkPlanner/
├── backend/                    → API REST (Spring Boot + Java 21)
│   ├── src/main/java/...       → código del backend
│   ├── src/main/resources/
│   │   └── application-dev.yaml → ⚠️ aquí va tu API key (no commitear)
│   └── sql/init.sql            → script de la BD
│
├── frontend-react/             → SPA React + Vite + Tailwind
│   ├── src/
│   │   ├── components/         → Sidebar, Modal, AIChatPanel, etc.
│   │   ├── pages/              → Dashboard, Tasks, Kanban
│   │   ├── services/           → llamadas al backend
│   │   └── App.jsx             → rutas
│   └── .env                    → URL del backend (no tocar normalmente)
│
└── SETUP.md                    → este archivo
```

---

## 12. Contacto

Si nada funciona después de seguir esta guía:

1. **Toma captura de la pantalla** donde está el error.
2. Anota **en qué paso de esta guía estás**.
3. Comparte con Santiago.

---

**Equipo UniWork Planner** · ITM Programación de Software · 2026

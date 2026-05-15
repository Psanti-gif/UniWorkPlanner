# UniWorkPlanner

Aplicación web para gestionar pendientes de universidad y trabajo.

## Integrantes

| Integrante | Rol |
|---|---|
| Yair Mosquera Murillo | Coordinación y soporte backend |
| Samuel Parra Cano | Backend (API REST y base de datos) |
| Santiago Pineda Vargas | Líder / Frontend (UI, vistas y consumo de API) |
| Sebastian Saldarriaga Yali | QA y documentación (pruebas, manuales y apoyo UI) |

## Tecnologías

| Capa | Stack |
|---|---|
| Frontend | React 19 + Vite 8 + Tailwind CSS 3 |
| Backend | Spring Boot 4.0.3 + Java 21 + Gradle |
| Base de datos | MySQL (JPA + patrón DAO) |
| API docs | Swagger / SpringDoc OpenAPI |

## Estructura del proyecto

```
UniWorkPlanner/
├── frontend-react/         → SPA React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     → Layout, Sidebar, Toast, Modal, Badge, Spinner
│   │   ├── pages/          → Dashboard, Tasks (lista/form/detalle/kanban)
│   │   └── services/       → api.js (axios), taskService.js
│   ├── .env                → VITE_API_URL
│   └── vite.config.js
└── backend/                → Spring Boot REST API
    ├── build.gradle
    ├── sql/init.sql         → Script de creación de BD
    └── src/main/java/edu/itm/gestorPendientes/
        ├── configuration/   → CORS, Swagger
        ├── controllers/     → REST Controllers
        ├── identidadesSQL/  → Entidades/Modelos
        ├── repositoriesSQL/ → Patrón DAO (JDBC) + JPA
        ├── services/        → Lógica de negocio
        └── utilities/       → Conexión a BD
```

## Cómo ejecutar

### Requisitos previos
- Java 21
- Node.js 18+
- MySQL corriendo (XAMPP o MySQL Server)

### 1. Base de datos
```sql
-- Ejecutar en MySQL:
source backend/sql/init.sql
```

### 2. Backend
```bash
cd backend
./gradlew bootRun
```
- Puerto: `http://localhost:8090`
- Swagger: `http://localhost:8090/uniworkplanner/swagger-ui.html`

### 3. Frontend
```bash
cd frontend-react
npm install
npm run dev
```
- Abre: `http://localhost:5173`

> El archivo `frontend-react/.env` ya apunta al backend en `http://localhost:8090/uniworkplanner`. No requiere configuración adicional.

## Funcionalidades

- Dashboard con estadísticas y tareas próximas a vencer
- Lista de tareas con filtros por estado, prioridad y búsqueda
- Crear / editar / eliminar tareas
- Detalle de tarea con cambio de estado inline
- Tablero Kanban con drag & drop

---

**Instituto Tecnológico Metropolitano (ITM)**  
Programación de Software — Docente: William Diaz Villegas  
2026

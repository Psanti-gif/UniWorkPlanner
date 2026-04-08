# UniWorkPlanner 📋

Aplicación web para gestionar pendientes de universidad y trabajo.

## Integrantes

| Integrante | Rol |
|---|---|
| Yair Mosquera Murillo | Coordinación y soporte backend |
| Samuel Parra Cano | Backend (API REST y base de datos) |
| Santiago Pineda Vargas | Líder / Frontend (UI, vistas y consumo de API) |
| Sebastian Saldarriaga Yali | QA y documentación (pruebas, manuales y apoyo UI) |

## Tecnologías

- **Frontend:** React + Tailwind CSS + Vite
- **Backend:** Spring Boot 4.0.3 + Java 17 + Gradle
- **Base de Datos:** MySQL (JDBC puro, patrón DAO)
- **Documentación API:** Swagger / SpringDoc OpenAPI

## Estructura del proyecto

```
UniWorkPlanner/
├── frontend/          → React + Tailwind (Vite)
└── backend/           → Spring Boot REST API
    ├── build.gradle
    ├── sql/init.sql   → Script para crear la BD
    └── src/main/java/edu/itm/gestorPendientes/
        ├── configuration/     → Swagger config
        ├── controllers/       → REST Controllers
        ├── identidadesSQL/    → Entidades/Modelos
        ├── repositoriesSQL/   → Patrón DAO (JDBC)
        ├── services/          → Lógica de negocio
        └── utilities/         → Conexión a BD
```

## Cómo ejecutar

### Backend
1. Tener MySQL corriendo (XAMPP o MySQL Server)
2. Ejecutar `backend/sql/init.sql` en MySQL
3. En la carpeta `backend/`: `./gradlew bootRun`
4. Swagger: `http://localhost:8090/uniworkplanner/swagger-ui.html`

### Frontend
1. En la carpeta `frontend/`: `npm install`
2. `npm run dev`
3. Abrir `http://localhost:5173`

---

**Instituto Tecnológico Metropolitano (ITM)**  
Programación de Software — Docente: William Diaz Villegas  
2026

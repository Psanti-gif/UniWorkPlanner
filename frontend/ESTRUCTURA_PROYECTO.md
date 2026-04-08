# Plan de Implementación: Gestor de Pendientes (Task Manager)

Este plan detalla el paso a paso estructurado para construir la aplicación web centralizadora de pendientes académicos y laborales, cumpliendo con los objetivos y el equipo definido. Aunque mencionaste una preferencia por "escritorio", como el objetivo describe una "aplicación web (con acceso desde PC y móvil)", nos enfocaremos en una web construida con React que sea responsiva (se verá ideal tanto en navegadores de PC como en el móvil), y si es completamente necesario en el futuro, se puede empaquetar fácilmente como aplicación nativa de escritorio usando herramientas como Electron o Tauri.

## Estructura Paso a Paso (Ciclo de Vida)

El proyecto se dividirá en las siguientes fases lógicas, alineadas con los objetivos específicos y los roles del equipo.

### Fase 1: Levantamiento de Requisitos y Planificación (Semanas 1-2)
**Objetivo:** Tener claro *qué* se va a construir antes de escribir código.
*   **Historias de Usuario:** Redactar historias como "Como estudiante, quiero crear una tarea con fecha límite para no olvidar entregarla".
*   **Definición del MVP (Minimum Viable Product):** Limitar el alcance a: CRUD de tareas, vistas (Lista, Kanban, Calendario), prioridades/etiquetas y registro manual.
*   **Herramientas:** Crear un tablero de Trello o Jira para llevar el seguimiento de las tareas.
*   **Responsables:** Todo el equipo (Santiago lidera la visión, Sebastian revisa la lógica de aceptación).

### Fase 2: Arquitectura y Diseño (Semanas 2-3)
**Objetivo:** Establecer los cimientos técnicos.
*   **Diseño UI/UX (Santiago & Sebastian):** Crear mockups o prototipos en Figma. Definir colores, tipografías y el diseño general (Desktop y Mobile).
*   **Modelado de Base de Datos (Samuel & Yair):** Diseñar las tablas (Usuarios, Pendientes, Etiquetas, Categorías) y sus relaciones (Diagrama Entidad-Relación).
*   **Contratos de API REST (Equipo Técnico):** Definir estructuralmente cómo se comunicará el Frontend con el Backend. (Ej: `GET /api/tasks`, `POST /api/tasks`). Documentar usando Swagger/OpenAPI o un documento simple.

### Fase 3: Configuración y Desarrollo de Backend - Java (Semanas 3-6)
**Objetivo:** Construir la base de datos y la API REST funcional.
*   **Configuración (Samuel & Yair):** Crear el proyecto en Spring Boot (Spring Web, Spring Data JPA). Configurar la conexión a la base de datos MySQL.
*   **Desarrollo de Endpoints (Samuel & Yair):**
    *   Auth y Gestión de Usuarios (Registro/Login básico, si se requiere).
    *   CRUD de Pendientes: Crear, Leer (con filtros por estado/vista), Actualizar, Borrar.
    *   Manejo de Etiquetas y Categorías (Universidad, Trabajo).
*   **Seguridad:** Asegurar las rutas (CORS habilitado para el frontend, tokens JWT opcionales para autenticación).

### Fase 4: Configuración y Desarrollo de Frontend - React + Tailwind (Semanas 4-7)
**Objetivo:** Construir la interfaz de usuario. *(Esta fase ocurre en paralelo al backend)*
*   **Inicialización (Santiago):** Crear el proyecto con Vite y React (`npm create vite@latest`). Configurar TailwindCSS.
*   **Desarrollo de Componentes Base (Santiago):** Botones, Inputs, Tarjetas de tareas, Layout principal (Sidebar/Navbar).
*   **Desarrollo de Vistas (Santiago con apoyo de Sebastian):**
    *   Vista de Lista.
    *   Vista Kanban (Tablero con columnas: Pendiente, En Progreso, Completado).
    *   Vista de Calendario.
*   **Integración (Santiago):** Consumir la API REST de Java utilizando `fetch` o `axios` (Conectar el Fronend con los datos reales).

### Fase 5: Pruebas y QA (Semanas 7-8)
**Objetivo:** Validar que todo funciona como debería y sin errores.
*   **Pruebas Backend (Sebastian):** Probar los endpoints REST usando herramientas como Postman o Insomnia. Validar reglas de negocio.
*   **Pruebas Frontend/Navegación (Sebastian):** Pruebas cruzadas (Clickear botones, llenar formularios, verificar que la vista actualiza y envía datos correctos).
*   **Resolución de Bugs:** El equipo corrige cualquier error (Yair/Samuel en backend, Santiago en frontend).

### Fase 6: Despliegue y Documentación (Semanas 8-9)
**Objetivo:** Entregar el proyecto para demostración.
*   **Despliegue Local o Nube (Yair/Samuel/Santiago):** Ejecutar bases de datos, backend y frontend en conjunto. (Sugerencia: Render, Vercel para frontend; Render o Railway para backend, o simplemente todo ejecutándose localmente para la materia).
*   **Documentación (Sebastian apoyado por el equipo):** 
    *   Manual Técnico (Cómo instalar dependencias, configurar DB y ejecutar).
    *   Manual de Usuario (Cómo se usa la app).
    *   Documentación de API.

---

## Asignación de Roles Sugerida

El equipo cuenta con responsabilidades muy bien equilibradas:

| Integrante | Rol Sugerido | Tareas Clave dentro de este Plan |
| :--- | :--- | :--- |
| **Yair Mosquera** | **Coordinador y Soporte Backend** | Modelado DB, configuración de entorno Spring, apoyo a Samuel con los controladores/servicios, despliegue del server. |
| **Samuel Parra** | **Backend y Base de Datos** | Creación de Entidades JPA, Repositorios, Controladores REST, y lógica de negocio principal en Java. |
| **Santiago Pineda** | **Líder, Frontend UI y Consumo API** | Arquitectura de React, creación de componentes con Tailwind, diseño de Vistas (Kanban/Calendario) y llamadas a la API. |
| **Sebastian Saldarriaga** | **QA, Documentación, y Soporte UI** | Diseño de pruebas, testeo manual de la App y APIs (Postman), redacción de manuales, y apoyo a Santiago diagramando componentes. |

## Decisiones Tomadas

> [!NOTE]
> 1. **Plataforma:** Aplicación Web Responsiva (React + Tailwind).
> 2. **Tecnologías Backend:** Uso exclusivo de **Spring Boot** para la API y **MySQL** como base de datos.
> 3. **Autenticación:** Habrá login para múltiples personas. Cada usuario debe poder ver únicamente sus propios pendientes y datos.
> 4. **Punto de Partida:** Iniciaremos scaffolding del proyecto base (Frontend primero) para integrarse más adelante a un repositorio de GitHub sincronizado.

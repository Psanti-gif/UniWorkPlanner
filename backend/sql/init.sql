-- script de creación de la base de datos
-- =====================================================
-- Script de inicialización de la Base de Datos
-- Proyecto: Gestor de Pendientes (UniWorkPlanner)
-- ITM - Programación de Software
-- =====================================================

CREATE DATABASE IF NOT EXISTS gestor_pendientes
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gestor_pendientes;

-- =====================================================
-- Tabla: tareas
-- =====================================================
CREATE TABLE IF NOT EXISTS tareas (
    idTarea INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATETIME,
    prioridad ENUM('ALTA', 'MEDIA', 'BAJA') DEFAULT 'MEDIA',
    estado ENUM('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA') DEFAULT 'PENDIENTE',
    categoria ENUM('UNIVERSIDAD', 'TRABAJO', 'PERSONAL') DEFAULT 'PERSONAL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Datos de prueba
-- =====================================================
INSERT INTO tareas (titulo, descripcion, fecha_vencimiento, prioridad, estado, categoria) VALUES
('Entregar proyecto de Programación', 'Implementar la API REST con Spring Boot y MySQL', '2026-04-15 23:59:00', 'ALTA', 'EN_PROGRESO', 'UNIVERSIDAD'),
('Estudiar para parcial de Bases de Datos', 'Repasar normalización, SQL avanzado y transacciones', '2026-04-10 08:00:00', 'ALTA', 'PENDIENTE', 'UNIVERSIDAD'),
('Revisar reporte semanal del trabajo', 'Consolidar métricas de la semana y enviar al jefe', '2026-04-09 17:00:00', 'MEDIA', 'PENDIENTE', 'TRABAJO'),
('Organizar notas de clase', 'Pasar apuntes de la semana a digital', '2026-04-12 20:00:00', 'BAJA', 'PENDIENTE', 'UNIVERSIDAD'),
('Preparar presentación del proyecto', 'Hacer slides para la sustentación del proyecto integrador', '2026-04-20 10:00:00', 'MEDIA', 'PENDIENTE', 'UNIVERSIDAD');

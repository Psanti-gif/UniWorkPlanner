package edu.itm.gestorPendientes.repositoriesSQL;

import org.springframework.stereotype.Service;

@Service
public class TareaRepositoryHelper {

    public String listarTareas() {
        return " SELECT idTarea, titulo, descripcion, fecha_creacion, fecha_vencimiento, prioridad, estado, categoria FROM tareas ORDER BY fecha_creacion DESC ";
    }

    public String obtenerTareaPorId() {
        return " SELECT idTarea, titulo, descripcion, fecha_creacion, fecha_vencimiento, prioridad, estado, categoria FROM tareas WHERE idTarea = ? ";
    }

    public String insertarTarea() {
        return " INSERT INTO tareas (titulo, descripcion, fecha_vencimiento, prioridad, estado, categoria) VALUES (?, ?, ?, ?, ?, ?) ";
    }

    public String actualizarTarea() {
        return " UPDATE tareas SET titulo = ?, descripcion = ?, fecha_vencimiento = ?, prioridad = ?, estado = ?, categoria = ? WHERE idTarea = ? ";
    }

    public String eliminarTarea() {
        return " DELETE FROM tareas WHERE idTarea = ? ";
    }
}

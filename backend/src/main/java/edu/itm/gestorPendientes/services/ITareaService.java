package edu.itm.gestorPendientes.services;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;

import java.util.List;

public interface ITareaService {

    List<Tarea> getTareas();

    Tarea getTareaPorId(Integer id);

    Tarea insertarTarea(Tarea tarea);

    Tarea actualizarTarea(Tarea tarea);

    boolean eliminarTarea(Integer id);
}

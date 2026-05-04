package edu.itm.gestorPendientes.repositoriesSQL;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;

import java.util.List;

public interface ITareaRepository {

    List<Tarea> getTareas();

    Tarea getTareaPorId(Integer id);

    Tarea insertarTarea(Tarea tarea);

    Tarea actualizarTarea(Tarea tarea);

    boolean eliminarTarea(Integer id);
}

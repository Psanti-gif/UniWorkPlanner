package edu.itm.gestorPendientes.services;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import edu.itm.gestorPendientes.repositoriesSQL.TareaRepositorySQL;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TareaServices {
    private final TareaRepositorySQL repositorySQL;

    public TareaServices(TareaRepositorySQL repositorySQL) {
        this.repositorySQL = repositorySQL;
    }

    public List<Tarea> getTareas() {
        return repositorySQL.getTareas();
    }

    public Tarea getTareaPorId(Integer id) {
        return repositorySQL.getTareaPorId(id);
    }

    public Tarea insertarTarea(Tarea tarea) {
        return repositorySQL.insertarTarea(tarea);
    }

    public Tarea actualizarTarea(Tarea tarea) {
        return repositorySQL.actualizarTarea(tarea);
    }

    public boolean eliminarTarea(Integer id) {
        return repositorySQL.eliminarTarea(id);
    }
}

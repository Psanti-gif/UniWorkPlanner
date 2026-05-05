package edu.itm.gestorPendientes.services;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import edu.itm.gestorPendientes.repositoriesSQL.ITareaRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Qualifier("servicioSQL")
public class TareaServices implements ITareaService {

    private final ITareaRepository repositorio;

    public TareaServices(@Qualifier("repositorioSQL") ITareaRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public List<Tarea> getTareas() {
        return repositorio.getTareas();
    }

    @Override
    public Tarea getTareaPorId(Integer id) {
        return repositorio.getTareaPorId(id);
    }

    @Override
    public Tarea insertarTarea(Tarea tarea) {
        return repositorio.insertarTarea(tarea);
    }

    @Override
    public Tarea actualizarTarea(Tarea tarea) {
        return repositorio.actualizarTarea(tarea);
    }

    @Override
    public boolean eliminarTarea(Integer id) {
        return repositorio.eliminarTarea(id);
    }
}

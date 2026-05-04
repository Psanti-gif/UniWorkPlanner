package edu.itm.gestorPendientes.repositoriesJPA;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import edu.itm.gestorPendientes.repositoriesSQL.ITareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

// Samuel Parra Cano - Backend (API REST y base de datos)
@Repository
@Qualifier("repositorioJPA")
public class TareaRepositoryJPAImpl implements ITareaRepository {

    @Autowired
    private TareaJpaRepository tareaJpaRepository;

    @Override
    public List<Tarea> getTareas() {
        return tareaJpaRepository.findAll();
    }

    @Override
    public Tarea getTareaPorId(Integer id) {
        Optional<Tarea> resultado = tareaJpaRepository.findById(id);
        return resultado.orElse(null);
    }

    @Override
    @Transactional
    public Tarea insertarTarea(Tarea tarea) {
        if (tarea.getPrioridad() == null) tarea.setPrioridad("MEDIA");
        if (tarea.getEstado() == null) tarea.setEstado("PENDIENTE");
        if (tarea.getCategoria() == null) tarea.setCategoria("PERSONAL");
        return tareaJpaRepository.save(tarea);
    }

    @Override
    @Transactional
    public Tarea actualizarTarea(Tarea tarea) {
        if (!tareaJpaRepository.existsById(tarea.getIdTarea())) {
            return null;
        }
        return tareaJpaRepository.save(tarea);
    }

    @Override
    @Transactional
    public boolean eliminarTarea(Integer id) {
        if (!tareaJpaRepository.existsById(id)) {
            return false;
        }
        tareaJpaRepository.deleteById(id);
        return true;
    }
}

package edu.itm.gestorPendientes.repositoriesJPA;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaJpaRepository extends JpaRepository<Tarea, Integer> {

    List<Tarea> findByEstado(String estado);

    List<Tarea> findByCategoria(String categoria);

    List<Tarea> findByPrioridad(String prioridad);

    @Query("SELECT t FROM Tarea t WHERE t.estado != 'COMPLETADA' ORDER BY t.fechaVencimiento ASC")
    List<Tarea> findTareasPendientesOrdenadas();

    // Yair Mosquera Murillo - Coordinacion y soporte backend
    @Query("SELECT t FROM Tarea t WHERE t.categoria = :categoria AND t.estado = :estado")
    List<Tarea> findByCategoriaAndEstado(@Param("categoria") String categoria,
                                         @Param("estado") String estado);

    long countByEstado(String estado);

    List<Tarea> findByTituloContainingIgnoreCase(String palabraClave);

    @Query("SELECT t FROM Tarea t WHERE t.prioridad = 'ALTA' AND t.estado != 'COMPLETADA'")
    List<Tarea> findTareasUrgentes();

    List<Tarea> findByEstadoOrderByPrioridadAsc(String estado);

}

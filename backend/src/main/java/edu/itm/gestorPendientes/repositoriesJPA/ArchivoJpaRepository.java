package edu.itm.gestorPendientes.repositoriesJPA;

import edu.itm.gestorPendientes.identidadesSQL.Archivo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArchivoJpaRepository extends JpaRepository<Archivo, Integer> {
    List<Archivo> findByIdTarea(Integer idTarea);
}

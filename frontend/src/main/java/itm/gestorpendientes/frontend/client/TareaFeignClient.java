package itm.gestorpendientes.frontend.client;

import itm.gestorpendientes.frontend.dto.TareaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "tarea-client", url = "${backend.base-url}")
public interface TareaFeignClient {

    @GetMapping("/tareas-jpa/listar")
    List<TareaDTO> listar();

    @GetMapping("/tareas-jpa/obtener/{id}")
    TareaDTO obtenerPorId(@PathVariable("id") Integer id);

    @PostMapping("/tareas-jpa/nuevo")
    TareaDTO crear(@RequestBody TareaDTO tarea);

    @PutMapping("/tareas-jpa/actualizar")
    TareaDTO actualizar(@RequestBody TareaDTO tarea);

    @DeleteMapping("/tareas-jpa/eliminar/{id}")
    ResponseEntity<Void> eliminar(@PathVariable("id") Integer id);
}

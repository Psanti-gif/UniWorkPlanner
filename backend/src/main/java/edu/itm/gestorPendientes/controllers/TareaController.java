package edu.itm.gestorPendientes.controllers;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import edu.itm.gestorPendientes.services.ITareaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("tareas")
public class TareaController {

    @Autowired
    @Qualifier("servicioSQL")
    private ITareaService services;

    @Operation(
            tags = {"Tareas SQL"},
            summary = "trae la lista de tareas (SQL/JDBC)",
            description = "permite consultar las tareas/pendientes usando SQL nativo y los devuelve como json",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "se ejecuta bien el servicio",
                            content = {
                                    @Content(
                                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                                            schema = @Schema(implementation = Tarea.class))
                            })
            }
    )
    @GetMapping("/listar")
    public ResponseEntity<List<Tarea>> getTareas() {
        return new ResponseEntity<>(services.getTareas(), HttpStatus.OK);
    }

    @Operation(
            tags = {"Tareas SQL"},
            summary = "obtiene una tarea por su ID (SQL/JDBC)",
            description = "busca y retorna una tarea especifica por su identificador usando SQL nativo",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "tarea encontrada",
                            content = {
                                    @Content(
                                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                                            schema = @Schema(implementation = Tarea.class))
                            }),
                    @ApiResponse(
                            responseCode = "404",
                            description = "tarea no encontrada")
            }
    )
    @GetMapping("/obtener/{id}")
    public ResponseEntity<Tarea> getTareaPorId(@PathVariable Integer id) {
        Tarea tarea = services.getTareaPorId(id);
        if (ObjectUtils.isEmpty(tarea)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(tarea, HttpStatus.OK);
    }

    @Operation(
            tags = {"Tareas SQL"},
            summary = "crea una nueva tarea (SQL/JDBC)",
            description = "permite insertar una nueva tarea/pendiente usando SQL nativo, el titulo es obligatorio",
            responses = {
                    @ApiResponse(
                            responseCode = "202",
                            description = "tarea creada exitosamente",
                            content = {
                                    @Content(
                                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                                            schema = @Schema(implementation = Tarea.class))
                            }),
                    @ApiResponse(
                            responseCode = "400",
                            description = "datos invalidos")
            }
    )
    @PostMapping("/nuevo")
    public ResponseEntity<Tarea> insertarTarea(@RequestBody Tarea tarea) {
        if (ObjectUtils.isEmpty(tarea) || ObjectUtils.isEmpty(tarea.getTitulo())) {
            return new ResponseEntity<>(tarea, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(services.insertarTarea(tarea), HttpStatus.ACCEPTED);
    }

    @Operation(
            tags = {"Tareas SQL"},
            summary = "actualiza una tarea existente (SQL/JDBC)",
            description = "permite modificar los datos de una tarea previamente creada usando SQL nativo",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "tarea actualizada exitosamente",
                            content = {
                                    @Content(
                                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                                            schema = @Schema(implementation = Tarea.class))
                            }),
                    @ApiResponse(
                            responseCode = "400",
                            description = "datos invalidos")
            }
    )
    @PutMapping("/actualizar")
    public ResponseEntity<Tarea> actualizarTarea(@RequestBody Tarea tarea) {
        if (ObjectUtils.isEmpty(tarea) || ObjectUtils.isEmpty(tarea.getIdTarea())) {
            return new ResponseEntity<>(tarea, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(services.actualizarTarea(tarea), HttpStatus.OK);
    }

    @Operation(
            tags = {"Tareas SQL"},
            summary = "elimina una tarea por su ID (SQL/JDBC)",
            description = "permite eliminar permanentemente una tarea de la base de datos usando SQL nativo",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "tarea eliminada exitosamente"),
                    @ApiResponse(
                            responseCode = "404",
                            description = "tarea no encontrada")
            }
    )
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Integer id) {
        boolean eliminada = services.eliminarTarea(id);
        if (eliminada) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

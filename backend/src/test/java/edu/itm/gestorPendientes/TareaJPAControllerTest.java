package edu.itm.gestorPendientes;

import edu.itm.gestorPendientes.controllers.TareaJPAController;
import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import edu.itm.gestorPendientes.services.ITareaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para TareaJPAController.
 * Verifica que los endpoints JPA respondan correctamente ante distintos escenarios.
 *
 * Integrante responsable: Sebastian Saldarriaga Yali
 * Rol: QA y documentacion
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas del controlador JPA")
class TareaJPAControllerTest {

    @Mock
    private ITareaService services;

    @InjectMocks
    private TareaJPAController tareaJPAController;

    private Tarea tareaUniversidad;
    private Tarea tareaTrabajo;

    @BeforeEach
    void setUp() {
        tareaUniversidad = new Tarea(1, "Entregar proyecto final JPA",
                "Implementar JPA con Spring Boot", new Date(), new Date(),
                "ALTA", "EN_PROGRESO", "UNIVERSIDAD");

        tareaTrabajo = new Tarea(2, "Informe semanal",
                "Preparar reporte de actividades", new Date(), null,
                "MEDIA", "PENDIENTE", "TRABAJO");
    }

    @Test
    @DisplayName("GET /tareas-jpa/listar debe retornar 200 con lista de tareas")
    void getTareas_debeResponder200ConListaCompleta() {
        when(services.getTareas()).thenReturn(Arrays.asList(tareaUniversidad, tareaTrabajo));

        ResponseEntity<List<Tarea>> respuesta = tareaJPAController.getTareas();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        assertEquals(2, respuesta.getBody().size());
        assertEquals("UNIVERSIDAD", respuesta.getBody().get(0).getCategoria());
        verify(services).getTareas();
    }

    @Test
    @DisplayName("GET /tareas-jpa/listar con lista vacia debe retornar 200 y lista vacia")
    void getTareas_cuandoNoHayTareas_debeResponder200ListaVacia() {
        when(services.getTareas()).thenReturn(List.of());

        ResponseEntity<List<Tarea>> respuesta = tareaJPAController.getTareas();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertTrue(respuesta.getBody().isEmpty());
    }

    @Test
    @DisplayName("GET /tareas-jpa/obtener/{id} con ID existente debe retornar 200")
    void getTareaPorId_cuandoExiste_debeResponder200() {
        when(services.getTareaPorId(1)).thenReturn(tareaUniversidad);

        ResponseEntity<Tarea> respuesta = tareaJPAController.getTareaPorId(1);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        assertEquals("EN_PROGRESO", respuesta.getBody().getEstado());
    }

    @Test
    @DisplayName("GET /tareas-jpa/obtener/{id} con ID inexistente debe retornar 404")
    void getTareaPorId_cuandoNoExiste_debeResponder404() {
        when(services.getTareaPorId(anyInt())).thenReturn(null);

        ResponseEntity<Tarea> respuesta = tareaJPAController.getTareaPorId(9999);

        assertEquals(HttpStatus.NOT_FOUND, respuesta.getStatusCode());
    }

    @Test
    @DisplayName("POST /tareas-jpa/nuevo con datos validos debe retornar 202")
    void insertarTarea_conTituloValido_debeResponder202() {
        when(services.insertarTarea(any(Tarea.class))).thenReturn(tareaUniversidad);

        ResponseEntity<Tarea> respuesta = tareaJPAController.insertarTarea(tareaUniversidad);

        assertEquals(HttpStatus.ACCEPTED, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        assertEquals("ALTA", respuesta.getBody().getPrioridad());
        verify(services).insertarTarea(tareaUniversidad);
    }

    @Test
    @DisplayName("POST /tareas-jpa/nuevo sin titulo debe retornar 400")
    void insertarTarea_sinTitulo_debeResponder400() {
        Tarea sinTitulo = new Tarea();

        ResponseEntity<Tarea> respuesta = tareaJPAController.insertarTarea(sinTitulo);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        verify(services, never()).insertarTarea(any());
    }

    @Test
    @DisplayName("PUT /tareas-jpa/actualizar con ID valido debe retornar 200")
    void actualizarTarea_conIdValido_debeResponder200() {
        tareaUniversidad.setEstado("COMPLETADA");
        when(services.actualizarTarea(any(Tarea.class))).thenReturn(tareaUniversidad);

        ResponseEntity<Tarea> respuesta = tareaJPAController.actualizarTarea(tareaUniversidad);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals("COMPLETADA", respuesta.getBody().getEstado());
    }

    @Test
    @DisplayName("DELETE /tareas-jpa/eliminar/{id} con ID existente debe retornar 200")
    void eliminarTarea_cuandoExiste_debeResponder200() {
        when(services.eliminarTarea(1)).thenReturn(true);

        ResponseEntity<Void> respuesta = tareaJPAController.eliminarTarea(1);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        verify(services).eliminarTarea(1);
    }

    @Test
    @DisplayName("DELETE /tareas-jpa/eliminar/{id} con ID inexistente debe retornar 404")
    void eliminarTarea_cuandoNoExiste_debeResponder404() {
        when(services.eliminarTarea(anyInt())).thenReturn(false);

        ResponseEntity<Void> respuesta = tareaJPAController.eliminarTarea(404);

        assertEquals(HttpStatus.NOT_FOUND, respuesta.getStatusCode());
    }
}

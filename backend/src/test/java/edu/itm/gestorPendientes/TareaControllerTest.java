package edu.itm.gestorPendientes;

import edu.itm.gestorPendientes.controllers.TareaController;
import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import edu.itm.gestorPendientes.services.ITareaService;
import org.junit.jupiter.api.BeforeEach;
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
 * Pruebas unitarias para TareaController (capa de presentacion).
 * Integrante responsable: Sebastian Saldarriaga Yali
 */
@ExtendWith(MockitoExtension.class)
class TareaControllerTest {

    @Mock
    private ITareaService services;

    @InjectMocks
    private TareaController tareaController;

    private Tarea tareaEjemplo;

    @BeforeEach
    void setUp() {
        tareaEjemplo = new Tarea(1, "Parcial de Bases de Datos", "Estudiar SQL y JPA",
                new Date(), new Date(), "ALTA", "PENDIENTE", "UNIVERSIDAD");
    }

    @Test
    void getTareas_debeResponder200ConListaDeTareas() {
        List<Tarea> tareasMock = Arrays.asList(tareaEjemplo,
                new Tarea(2, "Tarea de trabajo", null, new Date(), null, "MEDIA", "PENDIENTE", "TRABAJO"));
        when(services.getTareas()).thenReturn(tareasMock);

        ResponseEntity<List<Tarea>> respuesta = tareaController.getTareas();

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        assertEquals(2, respuesta.getBody().size());
        verify(services, times(1)).getTareas();
    }

    @Test
    void getTareaPorId_cuandoExiste_debeResponder200() {
        when(services.getTareaPorId(1)).thenReturn(tareaEjemplo);

        ResponseEntity<Tarea> respuesta = tareaController.getTareaPorId(1);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        assertEquals("Parcial de Bases de Datos", respuesta.getBody().getTitulo());
    }

    @Test
    void getTareaPorId_cuandoNoExiste_debeResponder404() {
        when(services.getTareaPorId(anyInt())).thenReturn(null);

        ResponseEntity<Tarea> respuesta = tareaController.getTareaPorId(999);

        assertEquals(HttpStatus.NOT_FOUND, respuesta.getStatusCode());
        assertNull(respuesta.getBody());
    }

    @Test
    void insertarTarea_cuandoTituloValido_debeResponder202() {
        when(services.insertarTarea(any(Tarea.class))).thenReturn(tareaEjemplo);

        ResponseEntity<Tarea> respuesta = tareaController.insertarTarea(tareaEjemplo);

        assertEquals(HttpStatus.ACCEPTED, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        verify(services, times(1)).insertarTarea(tareaEjemplo);
    }

    @Test
    void insertarTarea_cuandoTareaEsNull_debeResponder400() {
        ResponseEntity<Tarea> respuesta = tareaController.insertarTarea(null);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        verify(services, never()).insertarTarea(any());
    }

    @Test
    void insertarTarea_cuandoTituloEsVacio_debeResponder400() {
        Tarea tareaSinTitulo = new Tarea();
        tareaSinTitulo.setTitulo("");

        ResponseEntity<Tarea> respuesta = tareaController.insertarTarea(tareaSinTitulo);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        verify(services, never()).insertarTarea(any());
    }

    @Test
    void actualizarTarea_cuandoIdValido_debeResponder200() {
        when(services.actualizarTarea(any(Tarea.class))).thenReturn(tareaEjemplo);

        ResponseEntity<Tarea> respuesta = tareaController.actualizarTarea(tareaEjemplo);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
    }

    @Test
    void actualizarTarea_cuandoSinId_debeResponder400() {
        Tarea tareaSinId = new Tarea();
        tareaSinId.setTitulo("Sin ID");

        ResponseEntity<Tarea> respuesta = tareaController.actualizarTarea(tareaSinId);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        verify(services, never()).actualizarTarea(any());
    }

    @Test
    void eliminarTarea_cuandoExiste_debeResponder200() {
        when(services.eliminarTarea(1)).thenReturn(true);

        ResponseEntity<Void> respuesta = tareaController.eliminarTarea(1);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        verify(services, times(1)).eliminarTarea(1);
    }

    @Test
    void eliminarTarea_cuandoNoExiste_debeResponder404() {
        when(services.eliminarTarea(anyInt())).thenReturn(false);

        ResponseEntity<Void> respuesta = tareaController.eliminarTarea(999);

        assertEquals(HttpStatus.NOT_FOUND, respuesta.getStatusCode());
    }
}

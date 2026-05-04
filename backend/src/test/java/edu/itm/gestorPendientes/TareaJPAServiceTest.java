package edu.itm.gestorPendientes;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import edu.itm.gestorPendientes.repositoriesSQL.ITareaRepository;
import edu.itm.gestorPendientes.services.TareaJPAService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para TareaJPAService (implementacion JPA).
 * Integrante responsable: Yair Mosquera Murillo
 */
@ExtendWith(MockitoExtension.class)
class TareaJPAServiceTest {

    @Mock
    private ITareaRepository repositorio;

    @InjectMocks
    private TareaJPAService tareaJPAService;

    private Tarea tareaEjemplo;

    @BeforeEach
    void setUp() {
        tareaEjemplo = new Tarea(1, "Entregar proyecto final", "Subir al repositorio antes del viernes",
                new Date(), new Date(), "ALTA", "EN_PROGRESO", "UNIVERSIDAD");
    }

    @Test
    void getTareas_debeRetornarTodasLasTareas() {
        List<Tarea> tareasMock = Arrays.asList(
                tareaEjemplo,
                new Tarea(2, "Reunión de trabajo", "Revisar avance del sprint", new Date(), null, "MEDIA", "PENDIENTE", "TRABAJO"),
                new Tarea(3, "Comprar materiales", null, new Date(), null, "BAJA", "PENDIENTE", "PERSONAL")
        );
        when(repositorio.getTareas()).thenReturn(tareasMock);

        List<Tarea> resultado = tareaJPAService.getTareas();

        assertNotNull(resultado);
        assertEquals(3, resultado.size());
        verify(repositorio, times(1)).getTareas();
    }

    @Test
    void getTareaPorId_cuandoExiste_debeRetornarTarea() {
        when(repositorio.getTareaPorId(1)).thenReturn(tareaEjemplo);

        Tarea resultado = tareaJPAService.getTareaPorId(1);

        assertNotNull(resultado);
        assertEquals("Entregar proyecto final", resultado.getTitulo());
        assertEquals("EN_PROGRESO", resultado.getEstado());
        assertEquals("UNIVERSIDAD", resultado.getCategoria());
    }

    @Test
    void getTareaPorId_cuandoNoExiste_debeRetornarNull() {
        when(repositorio.getTareaPorId(anyInt())).thenReturn(null);

        Tarea resultado = tareaJPAService.getTareaPorId(500);

        assertNull(resultado);
        verify(repositorio).getTareaPorId(500);
    }

    @Test
    void insertarTarea_debePersistirConValoresPredeterminados() {
        Tarea tareasSinDefaults = new Tarea();
        tareasSinDefaults.setTitulo("Nueva tarea sin prioridad");

        Tarea tareaGuardada = new Tarea(10, "Nueva tarea sin prioridad", null,
                new Date(), null, "MEDIA", "PENDIENTE", "PERSONAL");
        when(repositorio.insertarTarea(any(Tarea.class))).thenReturn(tareaGuardada);

        Tarea resultado = tareaJPAService.insertarTarea(tareasSinDefaults);

        assertNotNull(resultado);
        assertEquals(10, resultado.getIdTarea());
        verify(repositorio, times(1)).insertarTarea(tareasSinDefaults);
    }

    @Test
    void actualizarTarea_debeRetornarTareaConNuevoEstado() {
        tareaEjemplo.setEstado("COMPLETADA");
        when(repositorio.actualizarTarea(any(Tarea.class))).thenReturn(tareaEjemplo);

        Tarea resultado = tareaJPAService.actualizarTarea(tareaEjemplo);

        assertNotNull(resultado);
        assertEquals("COMPLETADA", resultado.getEstado());
        assertEquals(1, resultado.getIdTarea());
    }

    @Test
    void actualizarTarea_cuandoNoExiste_debeRetornarNull() {
        when(repositorio.actualizarTarea(any(Tarea.class))).thenReturn(null);

        Tarea resultado = tareaJPAService.actualizarTarea(tareaEjemplo);

        assertNull(resultado);
    }

    @Test
    void eliminarTarea_cuandoExiste_debeEliminarYRetornarTrue() {
        when(repositorio.eliminarTarea(1)).thenReturn(true);

        boolean resultado = tareaJPAService.eliminarTarea(1);

        assertTrue(resultado);
        verify(repositorio).eliminarTarea(1);
    }

    @Test
    void eliminarTarea_cuandoNoExiste_debeRetornarFalse() {
        when(repositorio.eliminarTarea(anyInt())).thenReturn(false);

        boolean resultado = tareaJPAService.eliminarTarea(999);

        assertFalse(resultado);
    }
}

package edu.itm.gestorPendientes;

import edu.itm.gestorPendientes.identidadesSQL.Tarea;
import edu.itm.gestorPendientes.repositoriesSQL.ITareaRepository;
import edu.itm.gestorPendientes.services.TareaServices;
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
 * Pruebas unitarias para TareaServices (implementacion SQL).
 * Integrante responsable: Santiago Pineda Vargas
 */
@ExtendWith(MockitoExtension.class)
class TareaServiceTest {

    @Mock
    private ITareaRepository repositorio;

    @InjectMocks
    private TareaServices tareaServices;

    private Tarea tareaEjemplo;

    @BeforeEach
    void setUp() {
        tareaEjemplo = new Tarea(1, "Estudiar JPA", "Estudiar el modulo de JPA con Spring",
                new Date(), null, "ALTA", "PENDIENTE", "UNIVERSIDAD");
    }

    @Test
    void getTareas_debeRetornarListaDeTareas() {
        List<Tarea> tareasMock = Arrays.asList(tareaEjemplo,
                new Tarea(2, "Revisar correo", null, new Date(), null, "BAJA", "PENDIENTE", "TRABAJO"));
        when(repositorio.getTareas()).thenReturn(tareasMock);

        List<Tarea> resultado = tareaServices.getTareas();

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        verify(repositorio, times(1)).getTareas();
    }

    @Test
    void getTareas_cuandoNoHayTareas_debeRetornarListaVacia() {
        when(repositorio.getTareas()).thenReturn(List.of());

        List<Tarea> resultado = tareaServices.getTareas();

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
    }

    @Test
    void getTareaPorId_cuandoExiste_debeRetornarTarea() {
        when(repositorio.getTareaPorId(1)).thenReturn(tareaEjemplo);

        Tarea resultado = tareaServices.getTareaPorId(1);

        assertNotNull(resultado);
        assertEquals(1, resultado.getIdTarea());
        assertEquals("Estudiar JPA", resultado.getTitulo());
        verify(repositorio, times(1)).getTareaPorId(1);
    }

    @Test
    void getTareaPorId_cuandoNoExiste_debeRetornarNull() {
        when(repositorio.getTareaPorId(anyInt())).thenReturn(null);

        Tarea resultado = tareaServices.getTareaPorId(99);

        assertNull(resultado);
    }

    @Test
    void insertarTarea_cuandoDatosValidos_debeRetornarTareaCreada() {
        when(repositorio.insertarTarea(any(Tarea.class))).thenReturn(tareaEjemplo);

        Tarea resultado = tareaServices.insertarTarea(tareaEjemplo);

        assertNotNull(resultado);
        assertEquals("Estudiar JPA", resultado.getTitulo());
        assertEquals("ALTA", resultado.getPrioridad());
        verify(repositorio, times(1)).insertarTarea(tareaEjemplo);
    }

    @Test
    void insertarTarea_cuandoFalla_debeRetornarNull() {
        when(repositorio.insertarTarea(any(Tarea.class))).thenReturn(null);

        Tarea resultado = tareaServices.insertarTarea(tareaEjemplo);

        assertNull(resultado);
    }

    @Test
    void actualizarTarea_cuandoExiste_debeRetornarTareaActualizada() {
        tareaEjemplo.setEstado("COMPLETADA");
        when(repositorio.actualizarTarea(any(Tarea.class))).thenReturn(tareaEjemplo);

        Tarea resultado = tareaServices.actualizarTarea(tareaEjemplo);

        assertNotNull(resultado);
        assertEquals("COMPLETADA", resultado.getEstado());
        verify(repositorio, times(1)).actualizarTarea(tareaEjemplo);
    }

    @Test
    void eliminarTarea_cuandoExiste_debeRetornarTrue() {
        when(repositorio.eliminarTarea(1)).thenReturn(true);

        boolean resultado = tareaServices.eliminarTarea(1);

        assertTrue(resultado);
        verify(repositorio, times(1)).eliminarTarea(1);
    }

    @Test
    void eliminarTarea_cuandoNoExiste_debeRetornarFalse() {
        when(repositorio.eliminarTarea(anyInt())).thenReturn(false);

        boolean resultado = tareaServices.eliminarTarea(99);

        assertFalse(resultado);
    }
}

package itm.gestorpendientes.frontend.controller;

import itm.gestorpendientes.frontend.client.TareaFeignClient;
import itm.gestorpendientes.frontend.dto.TareaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/tareas")
public class TareaController {

    @Autowired
    private TareaFeignClient tareaClient;

    // LISTAR con filtros opcionales
    @GetMapping
    public String listar(Model model,
                         @RequestParam(required = false) String estado,
                         @RequestParam(required = false) String prioridad,
                         @RequestParam(required = false) String categoria,
                         @RequestParam(required = false) String q) {
        List<TareaDTO> tareas = tareaClient.listar();

        if (estado != null && !estado.isBlank()) {
            tareas = tareas.stream().filter(t -> estado.equals(t.getEstado())).collect(Collectors.toList());
        }
        if (prioridad != null && !prioridad.isBlank()) {
            tareas = tareas.stream().filter(t -> prioridad.equals(t.getPrioridad())).collect(Collectors.toList());
        }
        if (categoria != null && !categoria.isBlank()) {
            tareas = tareas.stream().filter(t -> categoria.equals(t.getCategoria())).collect(Collectors.toList());
        }
        if (q != null && !q.isBlank()) {
            String busqueda = q.toLowerCase();
            tareas = tareas.stream()
                    .filter(t -> (t.getTitulo() != null && t.getTitulo().toLowerCase().contains(busqueda))
                            || (t.getDescripcion() != null && t.getDescripcion().toLowerCase().contains(busqueda)))
                    .collect(Collectors.toList());
        }

        model.addAttribute("tareas", tareas);
        model.addAttribute("filtroEstado", estado != null ? estado : "");
        model.addAttribute("filtroPrioridad", prioridad != null ? prioridad : "");
        model.addAttribute("filtroCategoria", categoria != null ? categoria : "");
        model.addAttribute("filtroQ", q != null ? q : "");
        model.addAttribute("pageTitle", "Mis Tareas");
        return "tareas/list";
    }

    // DETALLE
    @GetMapping("/{id}")
    public String detalle(@PathVariable Integer id, Model model) {
        TareaDTO tarea = tareaClient.obtenerPorId(id);
        model.addAttribute("tarea", tarea);
        model.addAttribute("pageTitle", tarea.getTitulo());
        return "tareas/detail";
    }

    // FORMULARIO CREAR
    @GetMapping("/nueva")
    public String nuevaForm(Model model) {
        model.addAttribute("tarea", new TareaDTO());
        model.addAttribute("isNueva", true);
        model.addAttribute("pageTitle", "Nueva Tarea");
        return "tareas/form";
    }

    // GUARDAR NUEVA
    @PostMapping
    public String crear(@ModelAttribute TareaDTO tarea, RedirectAttributes ra) {
        try {
            tareaClient.crear(tarea);
            ra.addFlashAttribute("success", "Tarea creada exitosamente.");
        } catch (Exception e) {
            ra.addFlashAttribute("error", "Error al crear tarea: " + e.getMessage());
            return "redirect:/tareas/nueva";
        }
        return "redirect:/tareas";
    }

    // FORMULARIO EDITAR
    @GetMapping("/{id}/editar")
    public String editarForm(@PathVariable Integer id, Model model) {
        TareaDTO tarea = tareaClient.obtenerPorId(id);
        model.addAttribute("tarea", tarea);
        model.addAttribute("isNueva", false);
        model.addAttribute("pageTitle", "Editar Tarea");
        return "tareas/form";
    }

    // GUARDAR EDICION
    @PostMapping("/{id}")
    public String actualizar(@PathVariable Integer id,
                             @ModelAttribute TareaDTO tarea,
                             RedirectAttributes ra) {
        tarea.setIdTarea(id);
        try {
            tareaClient.actualizar(tarea);
            ra.addFlashAttribute("success", "Tarea actualizada.");
        } catch (Exception e) {
            ra.addFlashAttribute("error", "Error al actualizar: " + e.getMessage());
        }
        return "redirect:/tareas/" + id;
    }

    // ELIMINAR
    @PostMapping("/{id}/eliminar")
    public String eliminar(@PathVariable Integer id, RedirectAttributes ra) {
        try {
            tareaClient.eliminar(id);
            ra.addFlashAttribute("success", "Tarea eliminada.");
        } catch (Exception e) {
            ra.addFlashAttribute("error", "Error al eliminar tarea.");
        }
        return "redirect:/tareas";
    }

    // CAMBIAR ESTADO (AJAX para Kanban)
    @PostMapping("/{id}/estado")
    @ResponseBody
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id,
                                               @RequestParam String estado) {
        try {
            TareaDTO tarea = tareaClient.obtenerPorId(id);
            tarea.setEstado(estado);
            TareaDTO actualizada = tareaClient.actualizar(tarea);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // KANBAN
    @GetMapping("/kanban")
    public String kanban(Model model) {
        List<TareaDTO> tareas = tareaClient.listar();
        model.addAttribute("tareas", tareas);
        model.addAttribute("pageTitle", "Tablero Kanban");
        return "tareas/kanban";
    }
}

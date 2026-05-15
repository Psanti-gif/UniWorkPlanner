package itm.gestorpendientes.frontend.controller;

import itm.gestorpendientes.frontend.client.TareaFeignClient;
import itm.gestorpendientes.frontend.dto.TareaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class DashboardController {

    @Autowired
    private TareaFeignClient tareaClient;

    @GetMapping({"/", "/dashboard"})
    public String dashboard(Model model) {
        List<TareaDTO> tareas = tareaClient.listar();

        Map<String, Long> porEstado = tareas.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getEstado() != null ? t.getEstado() : "SIN_ESTADO",
                        Collectors.counting()
                ));

        Date hoy = new Date();
        long tresDias = 3L * 24 * 60 * 60 * 1000;

        List<TareaDTO> proximasVencer = tareas.stream()
                .filter(t -> t.getFechaVencimiento() != null
                        && !"COMPLETADA".equals(t.getEstado())
                        && !"CANCELADA".equals(t.getEstado())
                        && t.getFechaVencimiento().after(hoy)
                        && (t.getFechaVencimiento().getTime() - hoy.getTime()) <= tresDias)
                .sorted((a, b) -> a.getFechaVencimiento().compareTo(b.getFechaVencimiento()))
                .limit(5)
                .collect(Collectors.toList());

        long completadas = tareas.stream()
                .filter(t -> "COMPLETADA".equals(t.getEstado()))
                .count();

        model.addAttribute("tareas", tareas);
        model.addAttribute("porEstado", porEstado);
        model.addAttribute("proximasVencer", proximasVencer);
        model.addAttribute("totalTareas", tareas.size());
        model.addAttribute("completadas", completadas);
        model.addAttribute("pageTitle", "Dashboard");
        return "dashboard/index";
    }
}

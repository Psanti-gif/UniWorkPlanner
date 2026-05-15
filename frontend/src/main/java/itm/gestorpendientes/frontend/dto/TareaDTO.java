package itm.gestorpendientes.frontend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TareaDTO {

    private Integer idTarea;
    private String titulo;
    private String descripcion;
    private Date fechaCreacion;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date fechaVencimiento;

    private String prioridad;   // ALTA | MEDIA | BAJA
    private String estado;      // PENDIENTE | EN_PROGRESO | COMPLETADA | CANCELADA
    private String categoria;
}

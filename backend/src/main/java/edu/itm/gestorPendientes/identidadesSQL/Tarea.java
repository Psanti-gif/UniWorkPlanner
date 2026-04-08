package edu.itm.gestorPendientes.identidadesSQL;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tarea {
    private Integer idTarea;
    private String titulo;
    private String descripcion;
    private Date fechaCreacion;
    private Date fechaVencimiento;
    private String prioridad;
    private String estado;
    private String categoria;
}

package edu.itm.gestorPendientes.identidadesSQL;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "tareas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTarea")
    private Integer idTarea;

    @Column(name = "titulo", nullable = false, length = 255)
    private String titulo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private Date fechaCreacion;

    @Column(name = "fecha_vencimiento")
    private Date fechaVencimiento;

    @Column(name = "prioridad", length = 10)
    private String prioridad;

    @Column(name = "estado", length = 20)
    private String estado;

    @Column(name = "categoria", length = 20)
    private String categoria;
}

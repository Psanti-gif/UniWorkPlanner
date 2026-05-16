package edu.itm.gestorPendientes.identidadesSQL;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "archivos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Archivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idArchivo")
    private Integer idArchivo;

    @Column(name = "idTarea", nullable = false)
    private Integer idTarea;

    @Column(name = "nombre", nullable = false, length = 255)
    private String nombre;

    @Column(name = "tipo", length = 100)
    private String tipo;

    @Column(name = "ruta", nullable = false, length = 500)
    private String ruta;

    @Column(name = "tamanio")
    private Long tamanio;

    @Column(name = "fecha_subida", insertable = false, updatable = false)
    private Date fechaSubida;
}

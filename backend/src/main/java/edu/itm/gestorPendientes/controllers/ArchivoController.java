package edu.itm.gestorPendientes.controllers;

import edu.itm.gestorPendientes.identidadesSQL.Archivo;
import edu.itm.gestorPendientes.repositoriesJPA.ArchivoJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("archivos")
public class ArchivoController {

    @Autowired
    private ArchivoJpaRepository archivoRepo;

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping("/subir/{idTarea}")
    public ResponseEntity<Archivo> subir(@PathVariable Integer idTarea,
                                          @RequestParam("archivo") MultipartFile file) throws IOException {
        if (file.isEmpty()) return ResponseEntity.badRequest().build();

        Path dir = Paths.get(uploadDir, String.valueOf(idTarea)).toAbsolutePath().normalize();
        Files.createDirectories(dir);

        String originalName = file.getOriginalFilename();
        String safeName = UUID.randomUUID() + "_" +
                (originalName != null ? originalName.replaceAll("[^a-zA-Z0-9.\\-_]", "_") : "archivo");
        Path destino = dir.resolve(safeName);

        try (var in = file.getInputStream()) {
            Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
        }

        Archivo archivo = new Archivo();
        archivo.setIdTarea(idTarea);
        archivo.setNombre(originalName != null ? originalName : "archivo");
        archivo.setTipo(file.getContentType());
        archivo.setRuta(destino.toString());
        archivo.setTamanio(file.getSize());

        return ResponseEntity.status(HttpStatus.CREATED).body(archivoRepo.save(archivo));
    }

    @GetMapping("/listar/{idTarea}")
    public ResponseEntity<List<Archivo>> listar(@PathVariable Integer idTarea) {
        return ResponseEntity.ok(archivoRepo.findByIdTarea(idTarea));
    }

    @GetMapping("/descargar/{id}")
    public ResponseEntity<Resource> descargar(@PathVariable Integer id) throws MalformedURLException {
        Archivo archivo = archivoRepo.findById(id).orElse(null);
        if (archivo == null) return ResponseEntity.notFound().build();

        Path path = Paths.get(archivo.getRuta()).toAbsolutePath().normalize();
        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists() || !resource.isReadable()) return ResponseEntity.notFound().build();

        String contentType = archivo.getTipo() != null ? archivo.getTipo() : "application/octet-stream";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + archivo.getNombre() + "\"")
                .body(resource);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Archivo archivo = archivoRepo.findById(id).orElse(null);
        if (archivo == null) return ResponseEntity.notFound().build();

        try {
            Files.deleteIfExists(Paths.get(archivo.getRuta()));
        } catch (IOException ignored) {}

        archivoRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

package edu.itm.gestorPendientes.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("ia")
public class IAChatController {

    @Value("${anthropic.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> req) {
        try {
            String mensaje = (String) req.getOrDefault("mensaje", "");
            List<?> tareas = (List<?>) req.getOrDefault("tareas", List.of());

            if (apiKey == null || apiKey.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error",
                        "API key no configurada. Agrega 'anthropic.api-key' en application-dev.yaml y reinicia el backend."));
            }

            String system = buildSystem(tareas);
            String body = "{\"model\":\"claude-haiku-4-5-20251001\",\"max_tokens\":2048," +
                    "\"system\":\"" + esc(system) + "\"," +
                    "\"messages\":[{\"role\":\"user\",\"content\":\"" + esc(mensaje) + "\"}]}";

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");
            headers.setContentType(MediaType.APPLICATION_JSON);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.anthropic.com/v1/messages",
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    String.class);

            return ResponseEntity.ok(Map.of("respuesta", extractText(response.getBody())));

        } catch (HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", "Error API Anthropic (" + e.getStatusCode() + "): " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al contactar la IA: " + e.getMessage()));
        }
    }

    private String buildSystem(List<?> tareas) {
        StringBuilder sb = new StringBuilder();
        sb.append("Eres un asistente de productividad para UniWorkPlanner que puede EJECUTAR acciones reales.\n\n");

        sb.append("FORMATO DE RESPUESTA OBLIGATORIO — responde SIEMPRE en JSON puro (sin markdown, sin bloques de código):\n");
        sb.append("Sin acción: {\"mensaje\":\"tu respuesta\",\"accion\":null}\n");
        sb.append("Con acción: {\"mensaje\":\"descripción amigable\",\"accion\":{\"tipo\":\"TIPO\",\"descripcion\":\"resumen breve para confirmar\",...campos}}\n\n");

        sb.append("TIPOS DE ACCIÓN disponibles y sus campos adicionales:\n");
        sb.append("CAMBIAR_ESTADO  → idTarea (número), nuevoEstado (PENDIENTE|EN_PROGRESO|COMPLETADA|CANCELADA)\n");
        sb.append("CAMBIAR_PRIORIDAD → idTarea (número), nuevaPrioridad (ALTA|MEDIA|BAJA)\n");
        sb.append("CREAR_TAREA     → titulo (obligatorio), prioridad (ALTA|MEDIA|BAJA), estado (PENDIENTE), categoria (UNIVERSIDAD|TRABAJO|PERSONAL), descripcion (opcional), fechaVencimiento como YYYY-MM-DD (opcional)\n");
        sb.append("ELIMINAR_TAREA  → idTarea (número)\n\n");

        sb.append("REGLAS:\n");
        sb.append("- Propón acción SOLO cuando el usuario pida EXPLÍCITAMENTE modificar algo.\n");
        sb.append("- Para preguntas, análisis y recomendaciones usa accion:null.\n");
        sb.append("- Identifica la tarea correcta por título o ID desde el contexto.\n");
        sb.append("- El campo 'descripcion' dentro de accion debe ser claro para que el usuario confirme o rechace.\n\n");

        if (!tareas.isEmpty()) {
            sb.append("Tareas actuales del usuario:\n");
            for (Object t : tareas) {
                if (t instanceof Map<?, ?> m) {
                    Object id        = m.get("idTarea");
                    Object titulo    = m.get("titulo");
                    Object prioridad = m.get("prioridad");
                    Object estado    = m.get("estado");
                    Object fecha     = m.get("fechaVencimiento");
                    sb.append(String.format("- [#%s] \"%s\" | Prioridad: %s | Estado: %s | Vence: %s\n",
                            id        != null ? id        : "?",
                            titulo    != null ? titulo    : "Sin título",
                            prioridad != null ? prioridad : "-",
                            estado    != null ? estado    : "-",
                            fecha     != null ? fecha     : "Sin fecha"));
                }
            }
        }
        return sb.toString();
    }

    private String extractText(String json) {
        if (json == null) return "Sin respuesta.";
        String marker = "\"text\":\"";
        int start = json.indexOf(marker);
        if (start == -1) return "Sin respuesta.";
        start += marker.length();
        StringBuilder sb = new StringBuilder();
        boolean escaped = false;
        for (int i = start; i < json.length(); i++) {
            char c = json.charAt(i);
            if (escaped) {
                switch (c) {
                    case '"'  -> sb.append('"');
                    case 'n'  -> sb.append('\n');
                    case 'r'  -> sb.append('\r');
                    case 't'  -> sb.append('\t');
                    case '\\' -> sb.append('\\');
                    default   -> { sb.append('\\'); sb.append(c); }
                }
                escaped = false;
            } else if (c == '\\') {
                escaped = true;
            } else if (c == '"') {
                break;
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}

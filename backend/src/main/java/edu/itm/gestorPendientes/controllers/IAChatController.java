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
            String body = "{\"model\":\"claude-haiku-4-5-20251001\",\"max_tokens\":1024," +
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
        sb.append("Eres un asistente de productividad para UniWorkPlanner. ");
        sb.append("Ayudas al usuario a organizar y priorizar sus tareas académicas y laborales. ");
        sb.append("Responde siempre en español, de forma concisa y práctica.\\n\\n");

        if (!tareas.isEmpty()) {
            sb.append("Tareas actuales del usuario:\\n");
            for (Object t : tareas) {
                if (t instanceof Map<?, ?> m) {
                    Object id        = m.get("idTarea");
                    Object titulo    = m.get("titulo");
                    Object prioridad = m.get("prioridad");
                    Object estado    = m.get("estado");
                    Object fecha     = m.get("fechaVencimiento");
                    sb.append(String.format("- [#%s] \\\"%s\\\" | Prioridad: %s | Estado: %s | Vence: %s\\n",
                            id        != null ? id        : "?",
                            titulo    != null ? titulo    : "Sin título",
                            prioridad != null ? prioridad : "-",
                            estado    != null ? estado    : "-",
                            fecha     != null ? fecha     : "Sin fecha"));
                }
            }
            sb.append("\\nUsa este contexto para dar recomendaciones específicas y útiles.");
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

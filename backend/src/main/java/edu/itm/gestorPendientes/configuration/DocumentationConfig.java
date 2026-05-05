package edu.itm.gestorPendientes.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DocumentationConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(
                        new io.swagger.v3.oas.models.info.Info()
                                .title("UniWorkPlanner - API de Gestión de Tareas")
                                .version("1.0")
                                .description("API REST para gestionar tareas y pendientes de universidad y trabajo. Proyecto del curso de Programación de Software - ITM.")
                                .contact(new Contact()
                                        .name("Equipo Gestor Pendientes")
                                        .email("santiago@itm.edu.co")));
    }
}

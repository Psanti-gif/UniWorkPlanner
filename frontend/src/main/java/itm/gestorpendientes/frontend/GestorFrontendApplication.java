package itm.gestorpendientes.frontend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class GestorFrontendApplication {
    public static void main(String[] args) {
        SpringApplication.run(GestorFrontendApplication.class, args);
    }
}

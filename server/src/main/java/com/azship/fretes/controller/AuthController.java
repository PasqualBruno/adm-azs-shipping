// Local: src/main/java/com/azship/fretes/controller/AuthController.java

package com.azship.fretes.controller;

import com.azship.fretes.dto.LoginRequest;
import com.azship.fretes.dto.LoginResponse;
import com.azship.fretes.dto.RegisterRequest;
import com.azship.fretes.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api") // Define o prefixo /api para todas as rotas neste controller
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint para POST /api/register
     * Substitui seu: app.post("/api/register", ...)
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        // A validação de campos (se são nulos) será feita pelo Spring.
        // Vamos adicionar uma validação mais robusta (ex: @Valid) depois, se precisar.
        try {
            authService.register(registerRequest);
            // res.status(201).json({ message: "Usuário criado com sucesso!" });
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(java.util.Collections.singletonMap("message", "Usuário criado com sucesso!"));
        } catch (RuntimeException e) {
            // if (existingUser) { return res.status(409).json(...) }
            // if (error) { return res.status(500).json(...) }
            if (e.getMessage().contains("Usuário já cadastrado")) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT) // 409
                        .body(java.util.Collections.singletonMap("message", e.getMessage()));
            }
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR) // 500
                    .body(java.util.Collections.singletonMap("message", "Erro interno ao registrar usuário."));
        }
    }

    /**
     * Endpoint para POST /api/login
     * Substitui seu: app.post("/api/login", ...)
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // const token = jwt.sign(...)
            // res.json({ message: "Login bem-sucedido.", token, user: { ... } });
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // if (!user) { return res.status(401).json(...) }
            // if (!isPasswordValid) { return res.status(401).json(...) }
            // Se o AuthenticationManager falhar (usuário/senha errados),
            // ele lança uma exceção que podemos capturar.
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED) // 401
                    .body(java.util.Collections.singletonMap("message", "Usuário ou senha inválidos."));
        }
    }
}
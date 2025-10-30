
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
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.register(registerRequest);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(java.util.Collections.singletonMap("message", "Usuário criado com sucesso!"));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Usuário já cadastrado")) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT) 
                        .body(java.util.Collections.singletonMap("message", e.getMessage()));
            }
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR) 
                    .body(java.util.Collections.singletonMap("message", "Erro interno ao registrar usuário."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Tentando logar: " + loginRequest.getUserName());

            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Collections.singletonMap("message", "Usuário ou senha inválidos."));
        }
    }
}
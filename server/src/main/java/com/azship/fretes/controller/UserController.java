// Local: src/main/java/com/azship/fretes/controller/UserController.java

package com.azship.fretes.controller;

import com.azship.fretes.dto.UserResponse;
import com.azship.fretes.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint para GET /api/user
     * Substitui seu: app.get("/api/user", authenticateToken, ...)
     * * O 'authenticateToken' já é gerenciado pelo nosso JwtAuthenticationFilter,
     * que protege este endpoint automaticamente.
     */
    @GetMapping
    public ResponseEntity<?> getAuthenticatedUserData() {
        try {
            UserResponse userResponse = userService.getAuthenticatedUser();
            // if (user) { res.json(user); }
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            // else { res.status(404).json({ message: "Usuário não encontrado." }); }
            return ResponseEntity
                    .status(404)
                    .body(java.util.Collections.singletonMap("message", e.getMessage()));
        }
    }

    // O endpoint de 'logout' do seu Node não fazia nada no servidor.
    // No Spring com JWT, o logout é 100% responsabilidade do front-end
    // (apenas apagar o token do localStorage).
    // app.post("/api/logout", ...)
}
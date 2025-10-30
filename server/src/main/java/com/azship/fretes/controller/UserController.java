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

    @GetMapping
    public ResponseEntity<?> getAuthenticatedUserData() {
        try {
            UserResponse userResponse = userService.getAuthenticatedUser();
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(404)
                    .body(java.util.Collections.singletonMap("message", e.getMessage()));
        }
    }
}

// Local: src/main/java/com/azship/fretes/service/UserService.java

package com.azship.fretes.service;

import com.azship.fretes.dto.UserResponse;
import com.azship.fretes.model.User;
import com.azship.fretes.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String userName;
        if (principal instanceof UserDetails) {
            userName = ((UserDetails) principal).getUsername();
        } else {
            userName = principal.toString();
        }

        System.out.println("Tentando autenticar: " + userName);


        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado no banco de dados."));

        return new UserResponse(user);
    }
}
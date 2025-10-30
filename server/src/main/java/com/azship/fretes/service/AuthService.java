package com.azship.fretes.service;

import com.azship.fretes.dto.LoginRequest;
import com.azship.fretes.dto.LoginResponse;
import com.azship.fretes.dto.RegisterRequest;
import com.azship.fretes.model.User;
import com.azship.fretes.repository.UserRepository;
import org.springframework.context.annotation.Lazy; 
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthService(UserRepository userRepository,
                       @Lazy PasswordEncoder passwordEncoder, 
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UserDetailsServiceImpl userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }


    public void register(RegisterRequest registerRequest) {




        if (userRepository.findByUserName(registerRequest.getUserName()).isPresent()) {
            throw new RuntimeException("Usuário já cadastrado.");
        }
        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
        User newUser = new User();

        newUser.setUserName(registerRequest.getUserName());
        newUser.setName(registerRequest.getName());
        newUser.setPassword(hashedPassword);
        System.out.println("Usuário cadastrado: " + newUser.getUserName());
        userRepository.save(newUser);
    }

    public LoginResponse login(LoginRequest loginRequest) {

        System.out.println("Usuario " + loginRequest.getUserName());
        System.out.println("Senha " +loginRequest.getPassword());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUserName(),
                        loginRequest.getPassword()
                )
        );

        System.out.println("Authentication: " + authentication);
        UserDetails userDetails = userDetailsService
                .loadUserByUsername(loginRequest.getUserName());

        System.out.println("UserDetails: " + userDetails);


        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByUserName(loginRequest.getUserName())
                .orElseThrow(() -> new RuntimeException("Erro ao buscar dados do usuário após login."));

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.get_id(),
                user.getName()
        );

        return new LoginResponse(token, userInfo);
    }
}
// Local: src/main/java/com/azship/fretes/service/AuthService.java

package com.azship.fretes.service;

import com.azship.fretes.dto.LoginRequest;
import com.azship.fretes.dto.LoginResponse;
import com.azship.fretes.dto.RegisterRequest;
import com.azship.fretes.model.User;
import com.azship.fretes.repository.UserRepository;
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
    private final AuthenticationManager authenticationManager; // 1. INJETE
    private final JwtService jwtService; // 2. INJETE
    private final UserDetailsServiceImpl userDetailsService; // 3. INJETE

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, // 4. ATUALIZE O CONSTRUTOR
                       JwtService jwtService,
                       UserDetailsServiceImpl userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Lógica para registrar um novo usuário.
     * (Este método você já tem)
     */
    public void register(RegisterRequest registerRequest) {
        if (userRepository.findByUserName(registerRequest.getUserName()).isPresent()) {
            throw new RuntimeException("Usuário já cadastrado.");
        }
        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
        User newUser = new User();
        newUser.setUserName(registerRequest.getUserName());
        newUser.setName(registerRequest.getName());
        newUser.setPassword(hashedPassword);
        userRepository.save(newUser);
    }

    /**
     * 5. ADICIONE ESTE NOVO MÉTODO
     * Lógica para autenticar um usuário e retornar um token.
     * Substitui a lógica do seu endpoint POST /api/login
     */
    public LoginResponse login(LoginRequest loginRequest) {
        // if (!userName || !password) { ... }
        // A validação será feita no DTO.

        // Esta linha substitui o:
        // const user = await User.findOne({ userName });
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        //
        // O manager vai chamar o seu UserDetailsServiceImpl
        // e o PasswordEncoder automaticamente.
        // Se a senha ou usuário estiverem errados, ele lança uma exceção.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUserName(),
                        loginRequest.getPassword()
                )
        );

        // Se chegou aqui, o usuário está autenticado.
        // const userPayload = { userId: user._id, userName: user.userName };
        // const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "1h" });
        // Usamos o UserDetails para gerar o token
        UserDetails userDetails = userDetailsService
                .loadUserByUsername(loginRequest.getUserName());

        String token = jwtService.generateToken(userDetails);

        // Para replicar sua resposta:
        // res.json({ ..., user: { id: user._id, name: user.name } });
        // Precisamos buscar o usuário no banco para pegar o ID e o Nome.
        User user = userRepository.findByUserName(loginRequest.getUserName())
                .orElseThrow(() -> new RuntimeException("Erro ao buscar dados do usuário após login."));

        // Monta a resposta
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getName()
        );

        return new LoginResponse(token, userInfo);
    }
}
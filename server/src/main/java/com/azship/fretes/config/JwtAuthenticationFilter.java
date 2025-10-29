// Local: src/main/java/com/azship/fretes/config/JwtAuthenticationFilter.java

package com.azship.fretes.config;

import com.azship.fretes.service.JwtService;
import com.azship.fretes.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    // Este método é o equivalente direto ao seu 'authenticateToken'
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // const authHeader = req.headers["authorization"];
        final String authHeader = request.getHeader("Authorization");

        // if (token == null) return res.sendStatus(401);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // const token = authHeader && authHeader.split(" ")[1];
        final String jwt = authHeader.substring(7);

        // jwt.verify(token, JWT_SECRET, (err: any, userPayload: any) => { ... })
        final String userName = jwtService.extractUserName(jwt);

        // Se o usuário já estiver autenticado, não fazemos nada
        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userName);

            // Validamos o token
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // req.user = userPayload;
                // No Spring, fazemos isso:
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                // Autentica o usuário para esta requisição
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // next();
        filterChain.doFilter(request, response);
    }
}
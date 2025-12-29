package org.bin.parahub.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.bin.parahub.annotation.Profiled;
import org.bin.parahub.entity.User;
import org.bin.parahub.repository.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends org.springframework.web.filter.OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {
        System.out.println("Dev filter: вошли в фильтр!");

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            // Возьми любого пользователя (например, первого) — неважно, какой токен!
            User user = userRepository.findAll().stream().findFirst().orElse(null);
            if (user != null) {
                var auth = new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        user.getRole().name().equals("ADMIN") ?
                                java.util.List.of(() -> "ROLE_ADMIN", () -> "ROLE_USER") :
                                java.util.List.of(() -> "ROLE_USER")
                );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        chain.doFilter(request, response);
    }
}
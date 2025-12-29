package org.bin.parahub.controller;

import lombok.RequiredArgsConstructor;
import org.bin.parahub.dto.UserDTO;
import org.bin.parahub.entity.User;
import org.bin.parahub.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    // Профиль текущего пользователя
    @GetMapping("/me")
    public UserDTO getMe(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build();
    }

    // Только для админов: список всех пользователей
    @GetMapping
    public List<UserDTO> getAll(Authentication auth) {
        // Проверь роль, если нужно — либо Security дает доступ по .hasRole("ADMIN")
        return userRepository.findAll().stream().map(user -> UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .enabled(user.isEnabled())
                        .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                        .build())
                .collect(Collectors.toList());
    }
}
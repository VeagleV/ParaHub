package org.bin.parahub.controller;

import lombok.RequiredArgsConstructor;
import org.bin.parahub.dto.*;
import org.bin.parahub.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verifyEmail(@RequestBody VerifyCodeRequest request) {
        authService.verifyEmail(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend")
    public ResponseEntity<Void> resendCode(@RequestParam String email) {
        authService.resendCode(email);
        return ResponseEntity.ok().build();
    }

    // Первый этап логина: запрос на 2FA
    @PostMapping("/request-2fa")
    public ResponseEntity<Void> request2FA(@RequestBody LoginRequest request) {
        authService.request2FALoginCode(request.getEmail(), request.getPassword());
        return ResponseEntity.ok().build();
    }

    // Второй этап логина: подтвердить код
    @PostMapping("/login-2fa")
    public ResponseEntity<AuthResponse> login2FA(@RequestBody VerifyCodeRequest request) {
        return ResponseEntity.ok(authService.login2FA(request));
    }
}
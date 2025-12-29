package org.bin.parahub.controller;

import lombok.RequiredArgsConstructor;
import org.bin.parahub.annotation.Profiled;
import org.bin.parahub.dto.*;
import org.bin.parahub.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Profiled(logArgs = true, logResult = false)
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

    @PostMapping("/resend")
    public ResponseEntity<?> resend(@RequestBody Map<String, String> payload) {
        String email = payload.get("email"); // email приходит из body!
        authService.resendCode(email);
        return ResponseEntity.ok().build();
    }
}
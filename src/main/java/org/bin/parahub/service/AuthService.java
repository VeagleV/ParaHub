package org.bin.parahub.service;

import lombok.RequiredArgsConstructor;
import org.bin.parahub.dto.*;
import org.bin.parahub.entity.User;
import org.bin.parahub.entity.VerificationCode;
import org.bin.parahub.enums.UserRole;
import org.bin.parahub.repository.UserRepository;
import org.bin.parahub.repository.VerificationCodeRepository;
import org.bin.parahub.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    private static final int CODE_LENGTH = 6;
    private static final long CODE_VALID_MINUTES = 5;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email уже зарегистрирован");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username уже занят");
        }

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .enabled(false)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        sendVerificationCode(user.getEmail(), true);
    }

    @Transactional
    public void sendVerificationCode(String email, boolean forRegistration) {
        String code = String.format("%06d", new Random().nextInt(999999));
        VerificationCode verification = VerificationCode.builder()
                .email(email)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(CODE_VALID_MINUTES))
                .verified(false)
                .createdAt(LocalDateTime.now())
                .build();
        verificationCodeRepository.save(verification);

        String subject = forRegistration ?
                "Код подтверждения регистрации в ParaHub" :
                "Код для входа (2FA) в ParaHub";
        emailService.sendVerificationCode(email, code);
    }

    @Transactional
    public void verifyEmail(VerifyCodeRequest request) {
        VerificationCode verification = verificationCodeRepository
                .findByEmailAndCodeAndVerifiedFalse(request.getEmail(), request.getCode())
                .orElseThrow(() -> new IllegalArgumentException("Код не найден или уже использован"));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Код истёк");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        user.setEnabled(true);
        userRepository.save(user);
        verification.setVerified(true);
        verificationCodeRepository.save(verification);
    }

    @Transactional
    public void resendCode(String email) {
        sendVerificationCode(email, true);
    }

    public void request2FALoginCode(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Неверные email или пароль"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Неверные email или пароль");
        }
        if (!user.isEnabled()) {
            throw new IllegalArgumentException("E-mail не подтверждён");
        }
        sendVerificationCode(email, false);
    }

    @Transactional
    public AuthResponse login2FA(VerifyCodeRequest request) {
        VerificationCode verification = verificationCodeRepository
                .findByEmailAndCodeAndVerifiedFalse(request.getEmail(), request.getCode())
                .orElseThrow(() -> new IllegalArgumentException("Код не найден или уже использован"));
        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Код истёк");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        verification.setVerified(true);
        verificationCodeRepository.save(verification);

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        // Refresh токен можно делать как JWT или хранить в БД (упрощённо):
        String refreshToken = UUID.randomUUID().toString();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtil.getTokenValidityMs())
                .role(user.getRole().name())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
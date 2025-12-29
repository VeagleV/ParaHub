package org.bin.parahub.repository;

import org.bin.parahub.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findTopByEmailOrderByCreatedAtDesc(String email);
    Optional<VerificationCode> findByEmailAndCodeAndVerifiedFalse(String email, String code);
    void deleteByEmail(String email);
}
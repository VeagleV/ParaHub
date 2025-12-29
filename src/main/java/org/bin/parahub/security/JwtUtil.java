package org.bin.parahub.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import javax.crypto.SecretKey;

import org.bin.parahub.annotation.Profiled;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Profiled
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.token-validity-ms}")
    private long jwtValidityMs;

    public String generateToken(String subject, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtValidityMs);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        System.out.println("JWT secret: " + jwtSecret);

        return Jwts.builder()
                .subject(subject)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUsername(String token) {
        System.out.println("JWT secret during validation: " + jwtSecret);
        Claims claims = extractClaims(token);
        return claims.getSubject();
    }

    public String getRole(String token) {
        Claims claims = extractClaims(token);
        return claims.get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            System.out.println("JWT secret: " + jwtSecret);
            System.out.println(token);
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public long getTokenValidityMs() {
        return jwtValidityMs;
    }

    private Claims extractClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
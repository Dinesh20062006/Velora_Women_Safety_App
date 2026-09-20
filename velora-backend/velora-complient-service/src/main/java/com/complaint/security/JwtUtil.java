package com.complaint.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component

public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    private SecretKey signingKey;

    private SecretKey key() {
        if (signingKey == null) {
            signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        }
        return signingKey;
    }

    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public Long extractUserId(String token) {
        Object idObj = parseClaims(token).get("userId");
        if (idObj == null) return null;
        if (idObj instanceof Number) return ((Number) idObj).longValue();
        return Long.parseLong(idObj.toString());
    }

    public String extractEmail(String token) {
        String email = parseClaims(token).get("email", String.class);
        return email != null ? email : extractSubject(token);
    }

    public String extractName(String token) {
        return parseClaims(token).get("name", String.class);
    }

    public String extractPhoneNumber(String token) {
        String phone = parseClaims(token).get("phoneNumber", String.class);
        return phone != null ? phone : extractSubject(token);
    }

    public boolean isTokenValid(String token) {
        try {
            Date expiration = parseClaims(token).getExpiration();
            return expiration.after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

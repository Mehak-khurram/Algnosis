package com.algnosis.notification_service.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;


@Service
public class JWTService {

    private final String SECRET_KEY;

    public JWTService(@Value("${jwt.secret}") String secretKey) {
        this.SECRET_KEY = secretKey;
    }
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject(); // this is email
    }

    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
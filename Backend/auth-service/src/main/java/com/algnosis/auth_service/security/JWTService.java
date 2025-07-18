package com.algnosis.auth_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;

@Service
public class JWTService {

    private final String SECRET_KEY;

    public JWTService(@Value("${jwt.secret}") String secretKey) {
        this.SECRET_KEY = secretKey;
    }

    public String generateToken(String email, String role) {
        System.out.println(role);
        HashMap<String, Object> claim = new HashMap<>();
        claim.put("role", role);
        return Jwts.builder()
                .setSubject(email)
                .addClaims(claim)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
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
